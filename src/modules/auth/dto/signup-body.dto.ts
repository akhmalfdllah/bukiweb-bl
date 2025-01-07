import { IntersectionType } from "@nestjs/swagger";
import { CreateUserBodyDto, createUserBodySchema } from "src/modules/user/dto/create-user-body.dto";

export const signUpBodySchema = createUserBodySchema;
export class SignUpBodyDto extends IntersectionType(CreateUserBodyDto) {}