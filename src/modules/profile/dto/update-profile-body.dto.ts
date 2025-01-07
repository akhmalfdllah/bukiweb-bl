import z from "zod";
import { ApiProperty } from "@nestjs/swagger";

export const updateProfileBodySchema = z.object ({
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().min(1),
})

type UpdateProfileBodySchema = z.infer<typeof updateProfileBodySchema>;
export class UpdateProfileBodyDto implements UpdateProfileBodySchema { 
    @ApiProperty ({required: false})
    firstname: string;

    @ApiProperty ({required: false})
    lastname: string;

    @ApiProperty ({required: false})
    email: string;
}