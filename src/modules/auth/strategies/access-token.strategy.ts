import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtAccessName, JwtAccessSecretKey } from "src/configs/jwt.config";
import { DecodedUser } from "src/types/jwt.type";
@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, JwtAccessName) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: JwtAccessSecretKey,
        });
    }
    async validate(payload:DecodedUser) {
        return payload;
    }
}