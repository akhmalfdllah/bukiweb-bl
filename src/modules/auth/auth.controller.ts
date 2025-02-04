import { Controller, Post, Body, Req ,Res, HttpStatus, Get } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { CookieService } from "src/shared/services/cookie.service";
import { EnsureValid } from "src/shared/decorators/ensure-valid.decorator";
import { signUpBodySchema, SignUpBodyDto } from "./dto/signup-body.dto";
import { signInBodySchema, SignInBodyDto } from "./dto/signin-body.dto";
import { ApiBearerAuth } from "@nestjs/swagger";
import { RefreshTokenGuard } from "src/shared/decorators/refresh-token-guard.decorator";
import { User } from "src/shared/decorators/params/user.decorator";
import { DecodedUser } from "src/types/jwt.type";
import { TokenGuard } from "src/shared/decorators/token-guard.decorator";


@Controller()
export class AuthController {
    constructor (
        private authService: AuthService,
        private cookieService: CookieService,
    ){}

    @Post("signup")
    @EnsureValid(signUpBodySchema)
    async signUp(@Body() signUpBodyDto: SignUpBodyDto) {
        return await this.authService.signUp(signUpBodyDto);
    }

    @Post("signin")
    @EnsureValid(signInBodySchema)
    async signIn(@Body() signInBodyDto: SignInBodyDto, @Res() res: Response) {
        const {jwtRefreshToken, ...payload} = await this.authService.signIn(signInBodyDto);
        this.cookieService.setCookieRefreshToken(res, jwtRefreshToken);
        return res.status(HttpStatus.OK).send(payload)
    }

    @ApiBearerAuth()
    @Get("token")
    @RefreshTokenGuard()
    async getNewAccessToken(@Req () req: Request, @User() user: DecodedUser) {
        const refreshToken = this.cookieService.getCookieRefreshToken(req);
        return await this.authService.newAccessToken(user.id, refreshToken)
    }

    @ApiBearerAuth()
    @Get("signout")
    @RefreshTokenGuard()
    async signOut(@Req() req: Request, @Res() res: Response, @User() user: DecodedUser) {
        const refreshToken = this.cookieService.getCookieRefreshToken(req);
        const payload = await this.authService.signOut(user.id, refreshToken);
        this.cookieService.clearCookieRefreshToken(res);
        return res.status(HttpStatus.OK).send(payload);
    }

    @ApiBearerAuth()
    @Get("delete")
    @TokenGuard()
    async delete (@Res() res: Response, @User() user: DecodedUser) {
        const payload = await this.authService.delete(user.id);
        this.cookieService.clearCookieRefreshToken(res);
        return res.status(HttpStatus.OK).send(payload);
    }
}