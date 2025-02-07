import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { GroupService } from "./group.service";
import { EnsureValid, TokenGuard } from "src/shared/decorators/common.decorator";
import { CreateGroupBodyDto, createGroupBodySchema } from "./dto/create-group-body.dto";
import { SearchGroupQueryDto, searchGroupQuerySchema, SearchGroupQueryTransformed } from "./dto/search-group-query.dto";
import { UpdateGroupBodyDto, updateGroupBodySchema } from "./dto/update-group-body.dto";

@ApiBearerAuth()
@Controller("group")
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    @Post()
    @TokenGuard()
    @EnsureValid(createGroupBodySchema, "body")
    create(@Body() createGroupBodyDto: CreateGroupBodyDto) {
        return this.groupService.save(createGroupBodyDto);
    }

    @Get()
    @TokenGuard()
    @EnsureValid(searchGroupQuerySchema, "body")
    findAll(@Query() searchGroupQueryDto: SearchGroupQueryDto) {
        const searchGroupQuery = searchGroupQueryDto as unknown as SearchGroupQueryTransformed;
        return this.groupService.findAll(searchGroupQuery);
    }

    @Get(":id")
    @TokenGuard()
    findOne(@Param("id") id: string) {
        return this.groupService.findOne(id);
    }

    @Patch(":id")
    @TokenGuard()
    @EnsureValid(updateGroupBodySchema, "body")
    updated(@Param("id") id: string, @Body() updateGroupBodyDto: UpdateGroupBodyDto) {
        return this.groupService.saveUpdate(id, updateGroupBodyDto);
    }

    @Delete(":id")
    @TokenGuard()
    remove(@Param("id") id: string) {
        return this.groupService.remove(id);
    }
}