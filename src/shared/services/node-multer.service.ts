import { BadRequestException, Injectable } from "@nestjs/common";
import { MulterModuleOptions, MulterOptionsFactory } from "@nestjs/platform-express";
import * as fs from "fs";
import { diskStorage } from "multer";
import { NODE_UPLOAD_DIR } from "src/configs/env.config";

const ensureDirectoryExistence = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};
@Injectable()
export class NodeMulterService implements MulterOptionsFactory {
    createMulterOptions() {
        return this.configuration();
    }
    async configuration(): Promise<MulterModuleOptions> {
        const allowedMimeTypes = ["application/gzip", "application/x-gzip"];
        return {
            storage: diskStorage({
                destination: (req, file, callback) => {
                    const nodeId = req.params.id || "";
                    const destination = NODE_UPLOAD_DIR.concat("/", nodeId.toLowerCase());
                    if (nodeId) {
                        ensureDirectoryExistence(destination);
                        callback(null, destination);
                    } else {
                        callback(new BadRequestException("failed to upload node app!"), destination);
                    }
                },
                filename: (req, file, callback) => {
                    const fileName = "app.tar.gz";
                    callback(null, fileName);
                },
            }),
            fileFilter: (req, file, callback) => {
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(new BadRequestException("invalid file type. Expected a .tar.gz file."), true);
                }
            },
        };
    }
}
