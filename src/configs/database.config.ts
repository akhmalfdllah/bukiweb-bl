import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { DB_DATABASE_NAME, DB_HOST, DB_PASSWORD, DB_PORT, DB_TYPE, DB_USERNAME } from "./env.config";
import { isProduction } from "./constant";

export const DatabaseConfig: TypeOrmModuleOptions = {
    type: DB_TYPE as "mssql",
    database: DB_DATABASE_NAME,
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    synchronize: !isProduction(),
    autoLoadEntities: true,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
}

export const DatabaseTestConfig: TypeOrmModuleOptions = {
    type: "sqlite",
    database: "memory:",
    synchronize: true,
}

export enum TableName {
    User = "User",
    Node = "Node",
    Group = "Group",
    Profile = "Profile",
}

export enum NodeStatus {
    Ongoing = "ongoing",
    Postpone = "postpone",
    Complete = "complete",
    Cancelled = "cancelled",
}

export enum BooleanStatus {
    True = "true",
    False = "false",
}

export enum UserRole {
    Developer = "developer",
    User = "user",
    Root = "root",
}
