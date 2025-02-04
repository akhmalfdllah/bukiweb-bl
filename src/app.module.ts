import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StaticRootPath } from './configs/constant.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './configs/database.config';
import { NodeSubscriber } from './modules/node/node.subsciber';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { APP_FILTER } from '@nestjs/core';
import { appErrorFilter } from './shared/filters/app-error.filter';
import { NodeModule } from './modules/node/node.module';
//import { NodeModule } from './modules/node/node.module';

@Module({
  imports: [
    ServeStaticModule.forRoot ({
      rootPath: StaticRootPath,
    }),
    TypeOrmModule.forRoot({ ...DatabaseConfig, subscribers: [NodeSubscriber]}),
    AuthModule,
    UserModule,
    NodeModule,
    GroupModule,
    ProfileModule
  ],
  providers: [{provide: APP_FILTER, useClass: appErrorFilter}], 
})
export class AppModule {}
