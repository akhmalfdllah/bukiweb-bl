import { IntersectionType } from "@nestjs/swagger";
import { Profile } from "src/modules/profile/entities/profile.entity";

export class ProfilePayloadDto extends IntersectionType(Profile) {

}
export * from "src/modules/profile/entities/profile.entity";
