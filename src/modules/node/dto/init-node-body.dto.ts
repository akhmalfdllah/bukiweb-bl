import z from "zod";
import { ApiProperty } from "@nestjs/swagger";

export const initNodeBodySchema = z.object({
    devAppSource: z.string().startsWith("/", "invalid source path!").optional(),
    devCssSource: z.string().startsWith("/", "invalid source path!").optional(),
});

type InitNodeBodySchema = z.infer<typeof initNodeBodySchema>;
export class InitNodeBodyDto implements InitNodeBodySchema {
    @ApiProperty({required: false})
    devAppSource: string;

    @ApiProperty({required: false})
    devCssSource: string;
}