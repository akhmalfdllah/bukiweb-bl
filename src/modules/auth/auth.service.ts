import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { SignUpBodyDto } from "./dto/signup-body.dto";

export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,

    ) { }
    async signUp(signUpBodyDto: SignUpBodyDto) {
        return await this.userService.create(signUpBodyDto);
    }
}