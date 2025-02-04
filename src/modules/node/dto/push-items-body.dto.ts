import z from "zod";
import { ApiProperty } from "@nestjs/swagger";

export const pushItemsBodySchema = z.object({
    items: z.array(z.string()),
});

type PushItemsBodySchema = z.infer<typeof pushItemsBodySchema>;
export class PushItemsBodyDto implements PushItemsBodySchema {
    @ApiProperty()
    items: string[];
}