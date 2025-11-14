import { Controller, Get, Post, UseGuards, Body, Res, Req } from "@nestjs/common";
import { Public, ResponseMessage, User } from "src/decorator/customize";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./local-auth.guard";
import { RegisterUsesrDto, UserLoginDTO } from "src/users/dto/create-usesr.dto";
import { Request, Response } from "express";
import { IUsers } from "src/users/users.interface";
import { RolesService } from "src/roles/roles.service";
import { ApiBody, ApiTags } from "@nestjs/swagger";

@ApiTags('auth')
@Controller("auth") //consumer
export class AuthController {
    constructor(
        private authService: AuthService,
        private roleService: RolesService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    @ApiBody({type: UserLoginDTO})
    async login(
        @Req() req,
        @Res({ passthrough: true }) res: Response) {
        return this.authService.login(req.user, res)
    }


    @Public()
    @Post('/register')
    @ResponseMessage("User registered successfully")
    async register(@Body() registerUsesrDto: RegisterUsesrDto) {
        return this.authService.register(registerUsesrDto)
    }

    @Get('/account')
    @ResponseMessage('Get User account')
    async getAccount(@User() user: IUsers) {
        const temp = await this.roleService.findOne(user.role._id) as any
        user.permissions = temp.permissions
        return { user }
    }

    @Public()
    @Get('/refresh')
    @ResponseMessage('Get User refresh token')
    async handleRefreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        return this.authService.processNewToken(refreshToken, res)
    }

    @Post('/logout')
    @ResponseMessage('User logged out successfully')
    async logout(@User() user: IUsers, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(user._id, res)
    }

}
