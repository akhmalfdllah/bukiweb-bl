import { ApiProperty } from "@nestjs/swagger";
import z from "zod";
export const createGroupBodySchema = z.object({
    name: z.string().trim().min(1, { message: "name can't be empty"}).toLowerCase(),
    description: z.string().trim().min(1, {message: "description can't be empty"}),
});

type CreateGroupBodySchema = z.infer<typeof createGroupBodySchema>;
export class CreateGroupBodyDto implements CreateGroupBodySchema {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
}