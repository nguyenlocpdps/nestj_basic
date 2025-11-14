import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateCompanyDto {
    @IsNotEmpty({ message: "Name phải đúng định dạng" })
    name: string

    @IsNotEmpty({ message: "Address khong duoc de trong" })
    address: string

    @IsNotEmpty({ message: "Descripton khong duoc de trong" })
    description: string

    @IsNotEmpty({ message: "Logo is not empty" })
    logo: string

}
