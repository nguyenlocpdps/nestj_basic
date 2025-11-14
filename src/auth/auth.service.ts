import { BadRequestException, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/users/schemas/usesr.schema';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUsers } from 'src/users/users.interface';
import { genSaltSync, hashSync } from 'bcrypt';
import { RegisterUsesrDto } from 'src/users/dto/create-usesr.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import ms from 'ms';
import { Role, RoleDocument } from 'src/roles/schemas/role.schemas';
import { USER_ROLE } from 'src/databases/sample';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModal: SoftDeleteModel<UserDocument>,

        @InjectModel(Role.name)
        private roleModal: SoftDeleteModel<RoleDocument>,

        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private roleServices: RolesService
    ) { }

    hashPassword = (password: string) => {
        const saltRounds = 10
        const salt = genSaltSync(saltRounds);
        const hash = hashSync(password, salt);
        return hash
    }

    async validateUser(username: string, pass: string): Promise<any> {

        const user = await this.usersService.findOneByUsername(username);
        const isValid = await this.usersService.isValidPassword(pass, user.password)
        if (user) {
            if (isValid === true) {

                //fetch User Role
                const userRole = user.role as unknown as { _id: string, name: string }
                const temp = await this.roleServices.findOne(userRole._id)
                const objUser = {
                    ...user.toObject(),
                    permissions: temp?.permissions ?? []
                }
                return objUser
            }
        }
        return null;
    }

    async login(user: IUsers, response: Response) {
        const { _id, name, role, email, permissions } = user
        const payload = {
            username: user.email,
            // sub: user._id,
            name,
            _id,
            email,
            role,
            sub: "Token Login",
            iss: "From server"
        };

        const refresh_token = this.createRefreshToken(payload);
        const expireTime = Number((ms as unknown as (v: any) => number)(this.configService.get<string>('JWT_REFRESH_EXPIRE')));
        this.updateRefreshToken(_id, refresh_token);
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: expireTime
        })

        return {
            access_token: this.jwtService.sign(payload),
            info: {
                _id, name, email, role, permissions
            }
        };
    }

    createRefreshToken = (payload: any) => {
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRE'),
        })
        return refresh_token
    }

    updateRefreshToken = async (_id: string, refreshToken: string,) => {
        return await this.userModal.updateOne({
            _id
        }, {
            refreshToken
        })
    }

    async register(registerUsesrDto: RegisterUsesrDto) {
        const isExist = await this.userModal.findOne({ email: registerUsesrDto.email })
        if (isExist) {
            throw new BadRequestException(`Email ${registerUsesrDto.email} is already registered`)
        }
        const userRole = await this.roleModal.findOne({ USER_ROLE })
        const result = await this.userModal.create({
            name: registerUsesrDto.name,
            email: registerUsesrDto.email,
            password: this.hashPassword(registerUsesrDto.password),
            address: registerUsesrDto.address,
            age: registerUsesrDto.age,
            gender: registerUsesrDto.gender,
            role: userRole._id,
        })
        return {
            _id: result?._id,
            createdAt: result?.createdAt
        }
    }

    async processNewToken(refreshToken: string, response: Response) {
        try {
            this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET')
            })
            const user = await this.usersService.findUserByToken(refreshToken) as unknown as IUsers
            if (user) {
                // update refreshToken
                const { _id, name, role, email, permissions } = user
               
               

                //fetch User Role
                const userRole = user.role as unknown as { _id: string, name: string }
                const temp = await this.roleServices.findOne(userRole._id)

                  const payload = {
                    username: user.email,
                    // sub: user._id,
                    role,
                    permissions: temp?.permissions ?? [],
                    name,
                    _id,
                    email,
                    sub: "Token refresh",
                    iss: "From server"
                };

                 const refresh_token = this.createRefreshToken(payload);
                const expireTime = Number((ms as unknown as (v: any) => number)(this.configService.get<string>('JWT_REFRESH_EXPIRE')));
                await this.updateRefreshToken(_id.toString(), refresh_token);
                response.clearCookie('refresh_token');
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: expireTime
                })
               
                return {
                    access_token: this.jwtService.sign(payload),
                    info: {
                        _id,
                        name,
                        email,
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };
            } else {
                throw new BadRequestException('Invalid refresh token, please login again')
            }
        } catch (error) {
            throw new BadRequestException('Invalid refresh token, please login again')
        }
    }

    logout = async (_id: string, res: Response) => {
        await this.updateRefreshToken(_id, null);
        res.clearCookie('refresh_token');
        return "OK"
    }
}
