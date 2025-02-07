import z from "zod";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Prop } from "src/shared/utils/common.util";
import { Group } from "src/modules/group/entities/group.entity";
import { UserRole } from "src/configs/database.config";

export const updateUserBodySchema = z.object({
    role: z.nativeEnum(UserRole, { message: "invalid role" }).optional(),
    group: z.string().optional().transform(Prop.transFormId),
});

type UpdateUserBodySchema = z.infer<typeof updateUserBodySchema>;
export class UpdateUserBodyDto implements Omit<UpdateUserBodySchema, "group"> {
    @ApiProperty({ enum: UserRole, required: false }) 
    role: UserRole;

    @ApiProperty ({required: false})
    group: string
}

export class UpdateUserBodyTransformed extends OmitType(UpdateUserBodyDto, ["group"]) {
    role: UserRole;
    group: Group;
}