import { ApiProperty } from "@nestjs/swagger"
import z from "zod"

export const createProdfileBodySchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string() 
});

type CreateProdfileBodySchema = z.infer<typeof createProdfileBodySchema>
export class CreateProfileBodyDto implements CreateProdfileBodySchema {
    @ApiProperty()
    firstname: string;

    @ApiProperty()
    lastname: string;

    @ApiProperty()
    email: string;
}
