import { applyDecorators, UseGuards } from "@nestjs/common";
import { JwtRefreshGuard } from "src/shared/guards/jwt-refresh.guard";

export function SourceFile() {
    return applyDecorators(UseGuards(JwtRefreshGuard));
}
