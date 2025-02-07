import * as path from "path";
import * as fs from "fs";
import * as tar from "tar";
import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { NODE_UPLOAD_DIR } from "src/configs/env.config";
import { RootDir } from "src/configs/constant";

@Injectable()
export class FileSystemService {
    isFileExists = fs.existsSync;

    async extractFile(sourcePath: string, destinationPath: string) {
        return tar
            .x({ file: sourcePath, C: destinationPath })
            .then(() => ({ sourcePath, destinationPath }))
            .catch(() => {
                throw new InternalServerErrorException("failed to unzip node app!")
            })
    }

    removeZipFile(sourcePath: string) {
        fs.unlink(sourcePath, (error) => {
            if (error) {
                throw new InternalServerErrorException("something was wrong!")
            }
        });
    }
    nodeSourceFilePath(nodeId: string) {
        const basePath = path.join(NODE_UPLOAD_DIR, nodeId.toLowerCase());
        const html = path.join(basePath, "index.html");
        const js = path.join(basePath, "index.js");
        const jsMap = path.join(basePath, "index.js.map");
        const css = path.join(basePath, "index.css");
        const cssMap = path.join(basePath, "index.css.map");
        return { html, js, jsMap, css, cssMap };
    }

    async removeRF(destination: string) {
        await fs.promises.rm(destination, { recursive: true, force: true });
    }

    sourcePath(filepathUrl): string {
        return path.join(RootDir, filepathUrl)
    }


}