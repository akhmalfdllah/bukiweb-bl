import z from "zod";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Prop } from "src/shared/utils/common.util";
import { Node } from "src/modules/node/entities/node.entity"
export const createItemNodeBodySchema = z.object({
    name: z.string().trim().min(1, { message: "name can't be empty" }),
    description: z.string().trim().min(1, { message: "description can't be empty" }),
    url: z.string().startsWith("/", { message: "description can't be empty" }).transform(Prop.transformLowercase),
    parent: z.string().nullable().transform(Prop.transFormId),
});

type CreateItemNodeBodySchema = z.infer<typeof createItemNodeBodySchema>;
export class CreateItemNodeBodyDto implements Omit<CreateItemNodeBodySchema, "parent"> {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    url: string;

    @ApiProperty()
    parent: string;
}

export class CreateItemNodeBodyTransformed extends OmitType(CreateItemNodeBodyDto, ["parent"]) {
    parent: Node;
}