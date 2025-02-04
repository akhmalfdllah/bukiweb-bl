import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Node } from "./entities/node.entity";
import { MulterModule } from "@nestjs/platform-express";
import { NodeMulterService } from "src/shared/services/node-multer.service";
import { NodeController } from "./node.controller";

@Module({
    imports:[
        TypeOrmModule.forFeature([User, Node]),
        MulterModule.registerAsync({useClass: NodeMulterService}),
    ],
    controllers: [NodeController],
})

export class NodeModule{}

