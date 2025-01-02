import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor (
        @InjectRepository()
        private userRepository: Repository<>
        private argonService: ArgonService,
    ) {}
}