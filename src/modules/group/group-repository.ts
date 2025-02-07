import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Group } from "src/modules/group/entities/group.entity";

@Injectable()
export class GroupRepository extends Repository<Group> {
    constructor (
        @InjectRepository(Group)
        protected repository: Repository<Group>
    ) {
        super(repository.target, repository.manager, repository.queryRunner);
    }
}