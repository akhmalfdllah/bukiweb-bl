import { TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { EnvPath } from "src/configs/constant.config";
import * as dotenv from "dotenv";
dotenv.config({ path: EnvPath });
import { DatabaseTestConfig } from "src/configs/database.config";

export const closeConnnection = async (module: TestingModule) => {
    const datasource = module.get<DataSource>(DataSource);
    if (datasource) {
        await datasource.destroy();
    }
};

export const DBTestModule = TypeOrmModule.forRoot(DatabaseTestConfig);
export  {TypeOrmModule};