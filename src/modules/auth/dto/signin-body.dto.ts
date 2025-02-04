import { IntersectionType } from "@nestjs/swagger";
import { VerifyUserBodyDto, verifyUserBodySchema } from "src/modules/user/dto/verify-user-body.dto";

export const signInBodySchema = verifyUserBodySchema;
export class SignInBodyDto extends IntersectionType (VerifyUserBodyDto){}