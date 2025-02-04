import { ParseFilePipeBuilder, HttpStatus } from "@nestjs/common";

export const NodefileValidationPipe = new ParseFilePipeBuilder().build({
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
});
