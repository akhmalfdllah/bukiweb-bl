import z, { boolean } from "zod";
import { BooleanStatus, NodeStatus } from "src/configs/database.config";
import { Find } from "src/shared/utils/common.utils";
import { ApiProperty, OmitType  } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";
import { Node } from "src/modules/node/entities/node.entity";
export const searchNodeQuerySchema = z.object({
    isActive: z.nativeEnum(BooleanStatus).optional().transform(Find.transformBoolean),
    isPublished: z.nativeEnum(BooleanStatus).optional().transform(Find.transformBoolean),
    isInitialized: z.nativeEnum(BooleanStatus).optional().transform(Find.transIsInitialized),
    status: z.nativeEnum(NodeStatus).default(NodeStatus.Ongoing).optional(),
    developer: z.string().optional().transform(Find.transfomId),
    parent: z.string().optional().transform(Find.transfomId),
});

type SearchNodeQuerySchema = z.infer<typeof searchNodeQuerySchema>;
export class SearchNodeQueryDto implements Omit<SearchNodeQuerySchema, "isInitialized" | "developer" | "parent"> {
    @ApiProperty({ enum: BooleanStatus, required: false })
    isActive: boolean;

    @ApiProperty({ enum: BooleanStatus, required: false })
    isPublished: boolean;

    @ApiProperty({ enum: BooleanStatus, required: false })
    isInitialized: boolean;

    @ApiProperty({ enum: NodeStatus, required: false })
    status: NodeStatus;

    @ApiProperty({ required: false, default: null })
    developer: string;

    @ApiProperty({ required: false, default: null })
    parent: string
}
export class SearchNodeQueryTransformed extends OmitType(SearchNodeQueryDto, ["developer", "parent"]) {
    developer: User;
    parent: Node;
}