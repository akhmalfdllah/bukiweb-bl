import { TestingModule } from "@nestjs/testing";
import { AuthController } from "src/modules/auth/auth.controller";
import { AuthService } from "src/modules/auth/auth.service";

describe ("AuthController", () => {
    let controller: AuthController;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [AuthService],
        }).compile();
    })
})