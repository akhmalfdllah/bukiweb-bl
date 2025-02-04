import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ArgonService } from "src/shared/services/argon.service";
import { UserModule } from "src/modules/user/user.module";
import { CookieService } from "src/shared/services/cookie.service";
import { RefreshTokenStrategy } from "./strategies/refresh-token.strategy";
import { AccessTokenStrategy } from "./strategies/access-token.strategy";

@Module({
    imports: [JwtModule.register({global: true}), UserModule],
    controllers: [AuthController],
    providers: [AuthService, ArgonService, CookieService, RefreshTokenStrategy, AccessTokenStrategy],
    exports: [AuthService],
})
export class AuthModule{}