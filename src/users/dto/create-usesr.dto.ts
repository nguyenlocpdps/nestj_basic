import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import { IsEmail, IsMongoId, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator"
import mongoose from "mongoose"
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    name: string
}

export class CreateUsesrDto {
    @IsNotEmpty({ message: "Paword khong duoc de trong" })
    name: string

    @IsEmail({}, { message: "Email phải đúng định dạng" })
    email: string

    @IsNotEmpty({ message: "Paword khong duoc de trong" })
    password: string

    @IsNotEmpty({ message: "Age khong duoc de trong" })
    age: number

    @IsNotEmpty({ message: "Gender khong duoc de trong" })
    gender: string

    @IsNotEmpty({ message: "Address khong duoc de trong" })
    address: string

    @IsNotEmpty({ message: "Role khong duoc de trong" })
    @IsMongoId({ message: "Role Id must be MongoId" })
    role: string

    @IsNotEmptyObject()
    @ValidateNested()
    @IsObject()
    @Type(() => Company)
    company: Company
}

export class RegisterUsesrDto {
    @IsNotEmpty({ message: "Name khong duoc de trong" })
    name: string

    @IsEmail({}, { message: "Email phải đúng định dạng" })
    email: string

    @IsNotEmpty({ message: "Paword khong duoc de trong" })
    password: string

    @IsNotEmpty({ message: "Age khong duoc de trong" })
    age: number

    @IsNotEmpty({ message: "Gender khong duoc de trong" })
    gender: string

    @IsNotEmpty({ message: "Address khong duoc de trong" })
    address: string
}

export class UserLoginDTO {
     @IsNotEmpty({ message: "Uesrname khong duoc de trong" })
     @ApiProperty({name:'username', description: 'admin@gmail.com'})
    uesrname: string

     @IsNotEmpty({ message: "Password khong duoc de trong" })
     @ApiProperty({name:'password', description: '123456'})
    password: string
}

