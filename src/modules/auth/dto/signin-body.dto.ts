import { IntersectionType } from "@nestjs/swagger";
import { VerifyUserBodyDto, verifyUserBodySchema } from "src/modules/user/dto/verify-user-body.dto";

export const signinBodySchema = verifyUserBodySchema;
export class SigninBodyDto extends IntersectionType (VerifyUserBodyDto){}