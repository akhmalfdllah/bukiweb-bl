import { CookieOptions } from "express";
import { JWT_REFRESH_COOKIE_NAME } from "./env.config";
import { isProduction } from "./constant";

const getMaxAgeInDay = (day: number) => {
    return day * 24 * 60 * 60 * 1000;
};

export const JwtRefreshCookieName = JWT_REFRESH_COOKIE_NAME;
export const JwtRefreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    maxAge: getMaxAgeInDay(6),
};