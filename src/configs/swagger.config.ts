import { INestApplication } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";

export const configSwagger = (app: INestApplication<any>) => {
    const config = new DocumentBuilder()
        .setTitle("Management Application")
        .setDescription("The Next Management Application")
        .setVersion("1.0")
        .addBearerAuth()
        .build()
    const document = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("/docs", app, document, {
        jsonDocumentUrl: "/docs/swagger",
    });
    return { document, config};
}