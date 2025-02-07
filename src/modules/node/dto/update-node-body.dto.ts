import z from "zod";
import { Prop } from "src/shared/utils/common.util";
import { NodeStatus } from "src/configs/database.config";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { User } from "src/modules/user/entities/user.entity";
import { Node } from "src/modules/node/entities/node.entity"
export const updateNodeBodySchema = z.object({
    name: z.string().trim().min(1, { message: "name can't be empty" }).toLowerCase().optional(),
    description: z.string().trim().min(1, { message: "description can't be empty" }).optional(),
    url: z.string().startsWith("/", { message: "invalid url" }).optional().transform(Prop.transformLowercase),
    isActive: z.boolean().optional(),
    status: z.nativeEnum(NodeStatus).optional(),
    isPublished: z.boolean().optional(),
    developer: z.string().optional().transform(Prop.transFormId),
    parent: z.string().nullable().optional().transform(Prop.transFormId),
});

type UpdateNodeBodySchema = z.infer<typeof updateNodeBodySchema>;
export class UpdateNodeBodyDto implements Omit<UpdateNodeBodySchema, "parent" | "developer"> {
    @ApiProperty({ required: false })
    name: string;

    @ApiProperty({ required: false })
    description: string;

    @ApiProperty({ required: false })
    url: string;

    @ApiProperty({ required: false })
    status: NodeStatus;

    @ApiProperty({ required: false })
    isActive: boolean;

    @ApiProperty({ required: false })
    isPublished: boolean;

    @ApiProperty({ required: false })
    developer: string;

    @ApiProperty({ required: false })
    parent: string;
}
export class UpdateNodeBodyTransformed extends OmitType(UpdateNodeBodyDto, ["developer", "parent"]) {
    developer: User;
    parent: Node;
}