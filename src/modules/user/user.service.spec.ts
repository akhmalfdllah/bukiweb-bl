import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service"
import { DBTestModule, TypeOrmModule } from "src/shared/app-test/common.module";
import { User } from "./entities/user.entity";
import { ArgonService } from "src/shared/services/argon.service";
import { UserRepository } from "./user.repository";
import { Group } from "../group/entities/group.entity";

describe("UserService", () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [DBTestModule, TypeOrmModule.forFeature([User, Group])],
            providers: [ArgonService, UserService, UserRepository],
        }).compile();

        service = module.get<UserService>(UserService);
    }, 10000);

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
