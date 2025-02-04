import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const popItemsBodySchema = z.object({
    items: z.array(z.string()),
});

type PopItemsBodySchema = z.infer<typeof popItemsBodySchema>;
export class PopItemsBodyDto implements PopItemsBodySchema {
    @ApiProperty()
    items: [];
}