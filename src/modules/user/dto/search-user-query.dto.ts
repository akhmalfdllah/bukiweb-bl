import z from "zod";
import { UserRole } from "src/configs/database.config";
import { Find } from "src/shared/utils/common.dto";
import { ApiProperty, OmitType } from "@nestjs/swagger";
import { Group } from "src/modules/group/entities/group.entity";

export const searchUserQuerySchema = z.object({
    role: z.nativeEnum(UserRole, { message: "invalid role" }).optional(),
    group: z.string().optional().transform(Find.transFomId),
});

type SearchUserQuerySchema = z.infer<typeof searchUserQuerySchema>;
export class SearchUserQueryDto implements Omit<SearchUserQuerySchema, "node" | "group"> {
    @ApiProperty({ required: false, enum: UserRole })
    role: UserRole

    @ApiProperty({ required: false })
    group: string
}

export class SearchUserQueryTransformed extends OmitType(SearchUserQueryDto, ["group"]) {
    group: Group
}