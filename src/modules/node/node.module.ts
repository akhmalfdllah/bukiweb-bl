import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../user/entities/user.entity";
import { Node } from "./entities/node.entity";
import { MulterModule } from "@nestjs/platform-express";
import { NodeMulterService } from "src/shared/services/node-multer.service";
import { NodeController } from "./node.controller";
import { NodeRepository } from "./node.repository";
import { NodeService } from "./node.service";
import { FileSystemService } from "src/shared/services/file-system.service";
import { TokenService } from "src/shared/services/token.service";

@Module({
    imports:[
        TypeOrmModule.forFeature([User, Node]),
        MulterModule.registerAsync({useClass: NodeMulterService}),
    ],
    controllers: [NodeController],
    providers: [NodeRepository, NodeService, FileSystemService, TokenService],
    exports: [NodeService],
})

export class NodeModule{}

