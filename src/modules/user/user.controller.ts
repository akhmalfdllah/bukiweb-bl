import { Controller, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";

@ApiBearerAuth
@Controller("user")
export class UserController {
    constructor (private readonly userService: UserService){}

    @Get()
    @TokenGuard()
    @EnsureValid()

}