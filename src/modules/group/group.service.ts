import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { GroupRepository } from "./group-repository";
import { CreateGroupBodyDto } from "./dto/create-group-body.dto";
import { plainToInstance } from "class-transformer";
import { GroupPayloadDto } from "./dto/group-payload.dto";
import { SearchGroupQueryTransformed } from "./dto/search-group-query.dto";
import { UpdateGroupBodyDto } from "./dto/update-group-body.dto";

@Injectable()
export class GroupService {
    constructor(private groupRepository: GroupRepository) { }
    async save(createGroupBodyDto: CreateGroupBodyDto) {
        const existGroup = await this.groupRepository.findOneBy({ name: createGroupBodyDto.name });
        if (existGroup) {
            throw new ConflictException("group name already exist!");
        }
        const group = this.groupRepository.create(createGroupBodyDto);
        const newGroup = await this.groupRepository.save(group);
        return plainToInstance(GroupPayloadDto, newGroup);
    }

    async findAll({ app, member }: SearchGroupQueryTransformed) {
        const groups = await this.groupRepository.find({
            where: { apps: app, members: member },
            relations: { apps: true, members: true },
        });
        return plainToInstance(GroupPayloadDto, groups);
    }

    async findOne(id: string) {
        const group = await this.groupRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("group not found!");
        });
        return plainToInstance(GroupPayloadDto, group);
    }

    async saveUpdate(id: string, updateGroupBodyDto: UpdateGroupBodyDto) {
        const group = await this.groupRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("group not found!");
        });
        const updated = await this.groupRepository.save({ ...group, ...updateGroupBodyDto });
        return plainToInstance(GroupPayloadDto, updated);
    }

    async remove(id: string) {
        const group = await this.groupRepository.findOneByOrFail({ id }).catch(() => {
            throw new BadRequestException("group not found!");
        });
        return await this.groupRepository.remove(group);
    }
}