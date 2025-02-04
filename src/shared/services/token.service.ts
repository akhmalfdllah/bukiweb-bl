import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtCommonSignOptions } from "src/configs/jwt.config";

@Injectable()
export class TokenService {
    constructor(
        private jwtservice: JwtService) { }
    async signAsync<T extends object>(data: T) {
        return await this.jwtservice.signAsync(data, JwtCommonSignOptions);
    }

    async verifyAsync<T extends object>(token: string) {
        return await this.jwtservice.verifyAsync<T>(token, JwtCommonSignOptions).catch(() => {
          throw new UnauthorizedException("invalid token!");
        });
      }

}
