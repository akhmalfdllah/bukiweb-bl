import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtAccessGuard } from "src/shared/guards/jwt-access.guard";

export function DeveloperGuard() {
  return applyDecorators(UseGuards(JwtAccessGuard));
}
