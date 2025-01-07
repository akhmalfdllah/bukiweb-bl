import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CookieService } from "src/shared/services/cookie.service";
import { EnsureValid } from "src/shared/decorators/ensure-valid.decorator";
import { SignUpBodyDto, signUpBodySchema } from "./dto/signup-body.dto";


@Controller()
export class AuthController {
    constructor (
        private authService: AuthService,
        private cookieservice: CookieService,
    ){}

    @Post("signup")
    @EnsureValid(signUpBodySchema)
    async signUp(@Body() signUpBodyDto: SignUpBodyDto) {
        return await this.authService.signUp(signUpBodyDto);
    }
}