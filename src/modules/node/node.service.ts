import { InjectRepository } from "@nestjs/typeorm";
import { Response } from "express";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { NodeRepository, relations } from "./node.repository";
import { TokenService } from "src/shared/services/token.service";
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { FileSystemService } from "src/shared/services/file-system.service";
import { CreateNodeBodyDto } from "./dto/create-node-body.dto";
import { plainToInstance } from "class-transformer";
import { NodePayloadDto } from "./dto/node-payload.dto";
import { CreateItemNodeBodyTransformed } from "./dto/create-item-node-body-dto";
import { Inherit, isNotEqual } from "src/shared/utils/common.util";
import { SearchNodeQueryTransformed } from "src/modules/node/dto/search-node-query.dto";
import { UpdateNodeBodyTransformed } from "./dto/update-node-body.dto";
import { InitNodeBodyDto } from "./dto/init-node-body.dto";
import { PushItemsBodyDto } from "./dto/push-items-body.dto";
import { PopItemsBodyDto } from "./dto/pop-items-body.dto";
import { DecodedNode, DecodedUser, JwtNodePayload } from "src/types/jwt.type";
import { NodeStatus } from "src/configs/database.config";

@Injectable()
export class NodeService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private nodeRepository: NodeRepository,
        private tokenService: TokenService,
        private fsService: FileSystemService,
    ) { }

    async create(id: string, createNodeBodyDto: CreateNodeBodyDto) {
        const developer = await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("developer not found!")
        });

        const saved = await this.nodeRepository.save({ ...createNodeBodyDto, developer });
        return plainToInstance(NodePayloadDto, saved);
    }

    async createitem(id: string, { parent, ...createItemNodeBodyDto }: CreateItemNodeBodyTransformed) {
        const developer = await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("developer not found!");
        });

        const parentNode = await this.nodeRepository.findOneOrFail({ where: parent }).catch(() => {
            throw new NotFoundException("parent not found!");
        });
        const inherited = Inherit.nodeToItem(parentNode)
        const childnode = { ...createItemNodeBodyDto, ...inherited, developer, parent };
        const saved = await this.nodeRepository.save(childnode);
        return plainToInstance(NodePayloadDto, saved);
    }

    async findAll({ isInitialized, ...searchNodeQueryDto }: SearchNodeQueryTransformed) {
        if (isInitialized) {
            searchNodeQueryDto["devAppSource"] = isInitialized;
        }
        const nodes = await this.nodeRepository.find({ where: searchNodeQueryDto, relations });
        return plainToInstance(NodePayloadDto, nodes);
    }

    async findOne(id: string) {
        const node = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(() => {
            throw new NotFoundException("node not found!");
        });
        return plainToInstance(NodePayloadDto, node);
    }

    async update(id: string, updateNodeBodyDto: UpdateNodeBodyTransformed) {
        const node = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(() => {
            throw new NotFoundException("node not found")
        });

        const updated = await this.nodeRepository.save({ ...node, ...updateNodeBodyDto });
        return plainToInstance(NodePayloadDto, updated);
    }

    async delete(id: string) {
        const node = await this.nodeRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("node not found!");
        });

        const childnode = await this.nodeRepository.findOneBy({ parent: { id } })
        if (childnode) {
            throw new ConflictException("the node is referenced by another node: ");
        }
        return await this.nodeRepository.remove(node);
    }

    async initDevelopment(id: string, initNodeBodyDto: InitNodeBodyDto) {
        const node = await this.nodeRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("node not found!");
        });
        const updated = await this.nodeRepository.save({ ...node, ...initNodeBodyDto });
        const message = "happy coding, guys!";
        return { message, node: plainToInstance(NodePayloadDto, updated) }
    }

    async pushItems(id: string, pushItemsBodyDto: PushItemsBodyDto) {
        if (pushItemsBodyDto.items.includes(id)) {
            throw new BadRequestException("you can't set self as self item");
        }
        const parent = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(() => {
            throw new ConflictException("node not found!");
        });
        const itemsToAdd = pushItemsBodyDto.items.filter((itemId) => {
            return !parent.items.some((existingItem) => existingItem.id === itemId);
        });
        const items = await Promise.all(
            itemsToAdd.map(async (itemId) => {
                const item = await this.nodeRepository.findOneByOrFail({ id: itemId }).catch(() => {
                    throw new NotFoundException(`item with id ${itemId} not found`);
                });
                if (!parent.items.includes(item)) return item;
            }),
        );
        if (parent.items && parent.items.length) {
            parent.items = [...parent.items, ...items];
            const updated = await this.nodeRepository.save({ ...parent });
            return plainToInstance(NodePayloadDto, updated);
        }
        parent.items = items;
        const updated = await this.nodeRepository.save({ ...parent });
        return plainToInstance(NodePayloadDto, updated);
    }

    async popItems(id: string, popItemsBodyDto: PopItemsBodyDto) {
        const parent = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(() => {
            throw new NotFoundException("node not found");
        });

        const items = parent.items.filter((item) => {
            return !popItemsBodyDto.items.some((deleteId) => item.id === deleteId);
        });

        const updated = await this.nodeRepository.save({ ...parent, items });
        return plainToInstance(NodePayloadDto, updated);
    }

    async generatePublishToken(id: string) {
        const node = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(() => {
            throw new BadRequestException("node not found");
        })

        const publishToken = await this.tokenService.signAsync<JwtNodePayload>({
            id: node.id,
            developer: node.developer.id,
        });
        const updated = await this.nodeRepository.save({ ...node, publishToken });
        return { node: plainToInstance(NodePayloadDto, updated), publishToken }
    }

    async publishNodeFile(id: string, token: string, user: DecodedUser, file: Express.Multer.File) {
        const node = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(async () => {
            await this.fsService.removeRF(file.destination);
            throw new BadRequestException("node not found!");
        });

        const decoded = await this.tokenService.verifyAsync<DecodedNode>(token);
        if (isNotEqual(node.id, decoded.id) || isNotEqual(user.id, decoded.developer)) {
            throw new UnauthorizedException("invalid user!");
        }

        const extracted = await this.fsService.extractFile(file.path, file.destination);
        this.fsService.removeZipFile(extracted.sourcePath);
        const filePath = this.fsService.nodeSourceFilePath(node.id);
        const appSource = filePath.js;
        const cssSource = filePath.css;
        const updated = await this.nodeRepository.save({
            ...node,
            isPublished: true,
            publishToken: null,
            appSource,
            cssSource,
        })
        return { node: plainToInstance(NodePayloadDto, updated), message: "publishing successfully!" };
    }

    async applyPublishConfig(id: string, user: DecodedUser) {
        const node = await this.nodeRepository.findOneOrFail({ where: { id }, relations }).catch(() => {
            throw new NotFoundException("node not found!");
        });
        if (isNotEqual(node.developer.id, user.id)) {
            throw new UnauthorizedException("invalid user!");
        }
        const updated = await this.nodeRepository.save({ ...node, status: NodeStatus.Complete, isActive: true });
        return plainToInstance(NodePayloadDto, updated);
    }

    async loadApp(res: Response, id: string) {
        try {
            const node = await this.nodeRepository.findOneOrFail({ where: { id, isPublished: true } });
            const sourcesPath = this.fsService.sourcePath(node.cssSource);
            res.type("application/javascript").sendFile(sourcesPath);
        } catch (error) {
            res.status(404).send(`<p class="app404">node unpublished or not found!</p>`)
        }
    }

    async loadStyle(res: Response, id: string) {
        try {
            const node = await this.nodeRepository.findOneOrFail({ where: { id, isPublished: true } });
            const sourcePath = this.fsService.sourcePath(node.cssSource);
            res.status(200).type("text/css").sendFile(sourcePath);
        } catch (error) {
            const css = `.app404 {
            color: white;
            background-color: red
            }`;
            res.status(200).type("text/css").send(css)
        }
    }
}
