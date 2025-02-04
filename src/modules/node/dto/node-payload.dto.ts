import { IntersectionType } from "@nestjs/swagger";
import { Node } from "src/modules/node/entities/node.entity";

export class NodePayloadDto extends IntersectionType(Node){}
export * from "src/modules/node/entities/node.entity";