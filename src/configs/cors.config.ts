import { CustomOrigin, CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

const customOrigin: CustomOrigin = (requestOrigin, callback) => {
    return callback (null, requestOrigin)
}

export const corsOptions: CorsOptions = {
    origin: customOrigin,
    credentials: true,
}