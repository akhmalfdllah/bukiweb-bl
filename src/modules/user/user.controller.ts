import { Body, Controller, Get, Param, Patch, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import {
    SearchUserQueryDto,
    SearchUserQueryTransformed,
    searchUserQuerySchema
} from "./dto/search-user-query.dto";
import { TokenGuard, EnsureValid } from "src/shared/decorators/common.decorator";
import { User } from "src/shared/decorators/params/user.decorator";
import { DecodedUser } from "src/types/jwt.type";
import { UpdateUserBodyDto, updateUserBodySchema, UpdateUserBodyTransformed } from "./dto/update-user-body.dto";
import { ChangePasswordBodyDto, changePasswordBodySchema } from "./dto/change-password-body.dto";


@ApiBearerAuth()
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @TokenGuard()
    @EnsureValid(searchUserQuerySchema, "query")
    async findAll(@Query() SearchUserQueryDto: SearchUserQueryDto) {
        const searchUserQuery = SearchUserQueryDto as unknown as SearchUserQueryTransformed;
        return await this.userService.findAll(searchUserQuery);
    }

    @Patch()
    @TokenGuard()
    @EnsureValid(updateUserBodySchema, "body")
    async update(@User() user: DecodedUser, @Body() updateUserBodyDto: UpdateUserBodyDto) {
        const updateUserBody = updateUserBodyDto as unknown as UpdateUserBodyTransformed;
        return await this.userService.update(user.id, updateUserBody);
    }

    @Patch()
    @TokenGuard()
    @EnsureValid(changePasswordBodySchema, "body")
    async changePassword(@User() user: DecodedUser, @Body() changePasswordBodyDto: ChangePasswordBodyDto) {
        return await this.userService.changePassword(user.id, changePasswordBodyDto);
    }

    @Get(":id")
    @TokenGuard()
    async findOne(@Param("id") id: string) {
        return await this.userService.findOne(id);
    }
}