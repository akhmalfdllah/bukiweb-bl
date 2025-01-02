import z from "zod";
import { ApiProperty } from "@nestjs/swagger";

export const changePasswordBodySchema = z.object({
    password: z.string().trim().min(1, "password can't be empty"),
    confirmPassword: z.string().trim().min(1, "confirm password can't be empty"),
});

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>;
export class ChangePasswordBodyDto implements ChangePasswordBodySchema {
    @ApiProperty()
    password: string;

    @ApiProperty()
    confirmPassword: string;
}
