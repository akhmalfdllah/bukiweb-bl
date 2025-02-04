import { EnvPath } from "src/configs/constant.config";
import * as dotenv from "dotenv";
dotenv.config({ path: EnvPath });
import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "src/app.module";
import { configSwagger } from "src/configs/swagger.config";
import { corsOptions } from "src/configs/cors.config";
import { APP_PORT } from "src/configs/env.config";
import { Mode } from "src/configs/constant.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOptions);
  app.use(cookieParser());
  configSwagger(app);
  await app.listen(APP_PORT);
  console.log(`[${Mode}] Run on port ${await app.getUrl()}`);
}
bootstrap();
