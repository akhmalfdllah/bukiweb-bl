import { ApiProperty } from "@nestjs/swagger";
import z from "zod";

export const createNodeBodySchema = z.object({
    name: z.string().trim().min(1, {message: "name can't be empty"}).toLowerCase(),
    description: z.string().trim().min(1, {message: "description can't be empty"}),
})

type CreateNodeBodySchema = z.infer<typeof createNodeBodySchema>;
export class CreateNodeBodyDto  implements Omit<CreateNodeBodySchema, "parent"> {
    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;
}