import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpExceptionBody,
    HttpStatus,
    InternalServerErrorException,
} from "@nestjs/common";
import { TypeORMError } from "typeorm";
import { HttpAdapterHost } from "@nestjs/core";
import { Response } from "express";

const ExceptionDidCatch = [InternalServerErrorException, TypeORMError];
type Exception = (typeof ExceptionDidCatch)[number];
@Catch(...ExceptionDidCatch)
export class appErrorFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }
    catch(exception: Exception, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const { httpAdapter } = this.httpAdapterHost;

        const errorBody: HttpExceptionBody = {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            error: "Internal Server Error",
            message: "Internal Server Error",
        }

        if (exception instanceof TypeORMError) {
            console.log("[APP_FILTER] DB error");
        } else {
            console.log("[APP_FILTER server error]");
        }
        console.log(exception)
        httpAdapter.reply(response, errorBody, errorBody.statusCode);
    }
}