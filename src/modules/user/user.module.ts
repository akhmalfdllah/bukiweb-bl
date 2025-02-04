import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "src/modules/user/user.controller";
import { ArgonService } from "src/shared/services/argon.service";
import { UserService } from "src/modules/user/user.service";
import { UserRepository } from "src/modules/user/user.repository";
import { Group } from "src/modules/group/entities/group.entity";
import { User } from "src/modules/user/entities/user.entity";

@Module({
    imports: [TypeOrmModule.forFeature([User, Group])],
    controllers: [UserController],
    providers: [UserRepository, UserService, ArgonService],
    exports: [UserService],
})
export class UserModule { }
