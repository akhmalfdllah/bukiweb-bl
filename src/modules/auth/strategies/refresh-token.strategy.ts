import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import type { DecodedUser } from "src/types/jwt.type";
import { JwtRefreshCookieName } from "src/configs/cookie.config"
import { JwtRefreshName, JwtRefreshSecretKey } from "src/configs/jwt.config";

const tokenExtractor: JwtFromRequestFunction<Request> = (req) => {
    const refreshTokenStrategy = req.cookies[JwtRefreshCookieName];
    return refreshTokenStrategy;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, JwtRefreshName) {
    constructor() {
        super({
            jwtFromRequest: tokenExtractor,
            ignoreExpiration: false,
            secretOrKey: JwtRefreshSecretKey,
        })
    }
    async validate(payload: DecodedUser) {
        return payload;
    }
}