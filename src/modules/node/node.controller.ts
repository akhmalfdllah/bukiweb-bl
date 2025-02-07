import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";
import { NodeService } from "./node.service";
import { EnsureValid, UploadFile, TokenGuard, DeveloperGuard, SourceFile } from "src/shared/decorators/common.decorator";
import { CreateNodeBodyDto, createNodeBodySchema } from "./dto/create-node-body.dto";
import { User } from "src/shared/decorators/params/user.decorator";
import { DecodedUser } from "src/types/jwt.type";
import { CreateItemNodeBodyDto, createItemNodeBodySchema, CreateItemNodeBodyTransformed } from "./dto/create-item-node-body-dto";
import { SearchNodeQueryDto, searchNodeQuerySchema, SearchNodeQueryTransformed } from "./dto/search-node-query.dto";
import { UpdateNodeBodyDto, updateNodeBodySchema, UpdateNodeBodyTransformed } from "./dto/update-node-body.dto";
import { InitNodeBodyDto, initNodeBodySchema } from "./dto/init-node-body.dto";
import { PushItemsBodyDto, pushItemsBodySchema } from "./dto/push-items-body.dto";
import { PopItemsBodyDto, popItemsBodySchema } from "./dto/pop-items-body.dto";
import { NodefileValidationPipe } from "src/shared/pipes/node-file-validation.pipe";

@ApiBearerAuth()
@Controller("node")
export class NodeController {
    constructor(private readonly nodeService: NodeService) { }
    @Post()
    @TokenGuard(["root", "developer"])
    @EnsureValid(createNodeBodySchema, "body")
    async create(@User() user: DecodedUser, @Body() createNodeBodyDto: CreateNodeBodyDto) {
        return await this.nodeService.create(user.id, createNodeBodyDto);
    }

    @Post("item")
    @TokenGuard(["root", "developer"])
    @EnsureValid(createItemNodeBodySchema, "body")
    async createItem(@User() user: DecodedUser, @Body() createItemNodeBodyDto: CreateItemNodeBodyDto) {
        const transformedDto = createItemNodeBodyDto as unknown as CreateItemNodeBodyTransformed
        return await this.nodeService.createitem(user.id, transformedDto);
    }

    @Get()
    @TokenGuard()
    @EnsureValid(searchNodeQuerySchema, "query")
    async findAll(@Query() searchNodeQueryDto: SearchNodeQueryDto) {
        const searchNodeQuery = searchNodeQueryDto as unknown as SearchNodeQueryTransformed;
        return await this.nodeService.findAll(searchNodeQuery);
    }

    @Get(":id")
    @TokenGuard(["root", "developer"])
    async findOne(@Param("id") id: string) {
        return await this.nodeService.findOne(id);
    }

    @Patch(":id")
    @TokenGuard(["root", "developer"])
    @EnsureValid(updateNodeBodySchema, "body")
    async update(@Param("id") id: string, @Body() updateNodeBodyDto: UpdateNodeBodyDto) {
        const transformedDto = updateNodeBodyDto as unknown as UpdateNodeBodyTransformed;
        return await this.nodeService.update(id, transformedDto);
    }

    @Delete(":id")
    @TokenGuard(["root", "developer"])
    async delete(@Param("id") id: string) {
        return await this.nodeService.delete(id);
    }

    @Patch(":id/init")
    @DeveloperGuard()
    @EnsureValid(initNodeBodySchema, "body")
    async initDevelopment(@Param("id") id: string, @Body() initBodyDto: InitNodeBodyDto) {
        return await this.nodeService.initDevelopment(id, initBodyDto);
    }

    @Patch(":id/items")
    @TokenGuard(["root", "developer"])
    @EnsureValid(pushItemsBodySchema, "body")
    async pushItems(@Param("id") id: string, @Body() pushItemsBodyDto: PushItemsBodyDto) {
        return await this.nodeService.pushItems(id, pushItemsBodyDto);
    }

    @Delete(":id/items")
    @TokenGuard(["root", "developer"])
    @EnsureValid(popItemsBodySchema, "body")
    async popItems(@Param("id") id: string, @Body() popItemsBodyDto: PopItemsBodyDto) {
        return await this.nodeService.popItems(id, popItemsBodyDto);
    }

    @Get(":id/publish")
    @TokenGuard(["root", "developer"])
    async generatePublishToken(@Param("id") id: string) {
        return await this.nodeService.generatePublishToken(id);
    }

    @Post(":id/publish")
    @UploadFile()
    async publishNodeFile(
        @User() user: DecodedUser,
        @UploadedFile(NodefileValidationPipe) file: Express.Multer.File,
        @Param("id") id: string,
        @Body() body: any,
    ) {
        return await this.nodeService.publishNodeFile(id, body.token, user, file);
    }

    @Patch(":id/js")
    @TokenGuard(["root", "developer"])
    async applyPublishConfig(@User() user: DecodedUser, @Param("id") id: string) {
        return await this.nodeService.applyPublishConfig(id, user);
    }

    @Get(":id/js")
    @SourceFile()
    async loadApp(@Param("id") id: string, @Res() res: Response) {
        this.nodeService.loadApp(res, id);
    }

    @Get(":id/css")
    @SourceFile()
    async loadStyle(@Param("id") id: string, @Res() res: Response) {
        this.nodeService.loadStyle(res, id);
    }
}