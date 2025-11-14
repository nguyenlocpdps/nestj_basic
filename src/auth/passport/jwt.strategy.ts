
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IUsers } from 'src/users/users.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configServices: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configServices.get<string>("JWT_ACCESS_TOKEN_SECRET"),
        });
    }

    async validate(payload: IUsers) {
        const { _id, name, role, email, permissions } = payload
        //req.user
        return { _id, name, role, email, permissions };
    }
}
