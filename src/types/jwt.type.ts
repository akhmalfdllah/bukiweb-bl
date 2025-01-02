import type { User } from "src/modules/user/entities/user.entity";
import type { Node } from "src/modules/node/entities/node.entity";
import { UserRole } from "src/configs/database.config";

export type JwtRole = `${UserRole}`;
export interface JwtParams extends Pick<User, "id" | "role"> { }
export interface JwtPayload extends Pick<JwtParams, "id" | "role"> { }
export interface DecodedUser extends JwtPayload {
    iat: number;
    exp: number;
}

// jwt-common
export interface JwtNodePayload extends Pick<Node, "id"> {
    developer: string;
}

export interface DecodedNode extends JwtNodePayload {
    iat: number;
    exp: number;
}
