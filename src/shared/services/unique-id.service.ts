import { Injectable } from "@nestjs/common";
import ShortUniqueId from "short-unique-id";

@Injectable()
export class UniqueIdService extends ShortUniqueId {
  constructor() {
    super({ length: 10 });
  }
}
