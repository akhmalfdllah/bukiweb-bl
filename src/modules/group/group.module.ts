import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Group } from "./entities/group.entity";
import { GroupController } from "./group.controller";
import { GroupRepository } from "./group-repository";
import { GroupService } from "./group.service";

@Module({
    imports: [TypeOrmModule.forFeature([Group])],
    controllers: [GroupController],
    providers: [GroupRepository, GroupService],
    exports: [GroupService],
})
export class GroupModule{}