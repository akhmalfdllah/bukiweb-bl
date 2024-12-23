import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from "dotenv";
dotenv.config({ path: EnvPath });
import * as cookieParser from 'cookie-parser';
import { corsOptions } from 'src/configs/cors.config';
import { configSwagger } from './configs/swagger.config';
import { APP_PORT } from "src/configs/env.config";
import { EnvPath, Mode } from "src/configs/constant.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(cookieParser());
  configSwagger(app);
  await app.listen(APP_PORT);
  console.log(`[${Mode} ] Run on port ${await app.getUrl}`);
}
bootstrap();
