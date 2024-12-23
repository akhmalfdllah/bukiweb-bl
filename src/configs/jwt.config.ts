import type { JwtSignOptions } from "@nestjs/jwt";

import { 
    JWT_REFRESH_EXPIRE_IN, 
    JWT_ACCESS_EXPIRE_IN, 
    JWT_REFRESH_NAME,
    JWT_ACCESS_NAME,
    JWT_ACCESS_SECRET_KEY,
    JWT_ROLE_KEY,
    JWT_COMMON_SECRECT_KEY,
    JWT_COMMON_EXPIRE_IN} from "src/configs/env.config";

export const JwtAccessName = JWT_ACCESS_NAME;
export const JwtAccessSecretKey = JWT_ACCESS_SECRET_KEY;
export const JwtAccessSignOptions: JwtSignOptions = {
    secret: JWT_ACCESS_SECRET_KEY,
    expiresIn: JWT_ACCESS_EXPIRE_IN,
};

export const JwtRefreshName = JWT_REFRESH_NAME;
export const JwtRefreshSecretKey = JWT_ACCESS_SECRET_KEY;
export const JwtRefreshSignOptions: JwtSignOptions = {
    secret: JWT_ACCESS_SECRET_KEY,
    expiresIn: JWT_REFRESH_EXPIRE_IN,
};

// ROLE GUARD
export const JwtRoleKey = JWT_ROLE_KEY

// CUSTOM JWT
export const JwtCommonSecretKey = JWT_COMMON_SECRECT_KEY;
export const JwtCommonSignOptions: JwtSignOptions = {
    secret: JWT_COMMON_SECRECT_KEY,
    expiresIn: JWT_COMMON_EXPIRE_IN,
}
