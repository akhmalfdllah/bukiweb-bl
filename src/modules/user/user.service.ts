import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Group } from "../group/entities/group.entity";
import { ArgonService } from "src/shared/services/argon.service";
import { UserRepository } from "./user.repository";
import { CreateUserBodyDto } from "./dto/create-user-body.dto";
import { plainToInstance } from "class-transformer";
import { UserPayloadDto } from "./dto/user-payload.dto";
import { SearchUserQueryDto, SearchUserQueryTransformed } from "./dto/search-user-query.dto";
import { UpdateUserBodyDto, UpdateUserBodyTransformed } from "./dto/update-user-body.dto";
import { VerifyUserBodyDto } from "./dto/verify-user-body.dto";
import { ChangePasswordBodyDto } from "./dto/change-password-body.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Group)
        private userRepository: UserRepository,
        private argonService: ArgonService,
        private groupRepository: Repository<Group>
    ) { }

    async create({ username, confirmPassword, ...bodyDto }: CreateUserBodyDto) {
        const user = await this.userRepository.findOneBy({ username });
        if (user) {
            throw new BadRequestException("user already exist!")
        }
        if (bodyDto.password !== confirmPassword) {
            throw new BadRequestException("confirm password not match!")
        }
        const password = await this.argonService.hashPassword(bodyDto.password);
        const entity = this.userRepository.create({ ...bodyDto, username, password })
        const saved = await this.userRepository.save(entity);
        return plainToInstance(UserPayloadDto, saved);
    }

    async findAll(searchUserQueryDto: SearchUserQueryTransformed) {
        console.log(searchUserQueryDto);
        const users = await this.userRepository.find({
            where: searchUserQueryDto,
            relations: { group: true, nodes: true },
        });
        return plainToInstance(UserPayloadDto, users);
    }

    async findOne(id: string) {
        const user = await this.userRepository
            .findOneOrFail({
                where: { id },
                relations: { nodes: true, group: true },
            })
            .catch(() => {
                throw new NotFoundException("user not found");
            })
        return plainToInstance(UserPayloadDto, user);
    }

    async update(id: string, { group, ...UpdateUserBodyDto }: UpdateUserBodyTransformed) {
        const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("user not found!");
        });
        if (group) {
            const existGroup = await this.groupRepository.findOneByOrFail({ ...group }).catch(() => {
                throw new NotFoundException("group not found!");
            });
            user.group = existGroup;
        }
        const updated = await this.userRepository.save({ ...user, ...UpdateUserBodyDto });
        return plainToInstance(UserPayloadDto, updated);
    }

    async verifyUser({ password, username }: VerifyUserBodyDto) {
        const user = await this.userRepository.findOneByOrFail({ username }).catch(() => {
            throw new BadRequestException("invalid username or passwrod")
        })
        const isValid = await this.argonService.verifyPassword(user.password, password);
        if (!isValid) {
            throw new BadRequestException("invalid username or password!");
        }
        return plainToInstance(UserPayloadDto, user);
    }

    async verifyUserWithRefreshToken(id: string, refreshToken: string) {
        const user = await this.userRepository.findOneByOrFail({ id, refreshToken }).catch(() => {
            throw new UnauthorizedException("invalid token!!")
        });
        return plainToInstance(UserPayloadDto, user);
    }

    async changePassword(id: string, { password, confirmPassword }: ChangePasswordBodyDto) {
        if (password !== confirmPassword) {
            throw new BadRequestException("confirm password not match!");
        }
        const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("user not found!");
        });
        const hashPassword = await this.argonService.hashPassword(password);
        const saved = await this.userRepository.save({ ...user, password: hashPassword });
        return plainToInstance(UserPayloadDto, saved)
    }

    async signOut(id: string, refreshToken: string) {
        const user = await this.userRepository.findOneByOrFail({ id, refreshToken }).catch(() => {
            throw new UnauthorizedException("invalid token!");
        });
        const updated = await this.userRepository.update(user.id, { refreshToken: null });
        return plainToInstance(UserPayloadDto, updated);
    }

    async updateRefreshToken(user: UserPayloadDto, refreshToken: string) {
        const updated = await this.userRepository.save({ ...user, refreshToken });
        return plainToInstance(UserPayloadDto, updated);
    }

    async delete(id: string) {
        const user = await this.userRepository.findOneByOrFail({ id }).catch(() => {
            throw new NotFoundException("user not found!");
        });
        const deleted = await this.userRepository.remove(user).catch(() => {
            throw new ConflictException(
                "unable to delete this record due to existing references in related tables.",
            );
        });
        return { message: `user ${deleted.username} successfully deleted.` };
    }
}