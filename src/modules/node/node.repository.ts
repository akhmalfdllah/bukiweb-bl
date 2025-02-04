import { Injectable } from "@nestjs/common";
import { Repository, FindOptionsRelations } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Node } from "./entities/node.entity";


@Injectable()
export class NodeRepository extends Repository<Node> {
    constructor (
        @InjectRepository(Node)
        protected repository: Repository<Node>,
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}

export const relations: FindOptionsRelations<Node> = {
    parent: true,
    developer: true,
    items: true,
    groups: true,
};