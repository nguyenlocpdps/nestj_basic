import { ArrayNotEmpty, IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CreateSubscriberDto {
    @IsNotEmpty({ message: "Email is not empty" })
    @IsEmail()
    email: string

    @IsNotEmpty({ message: "Name is not empty" })
    name: string

    @IsArray()
    @IsString({ each: true, message: "Skill must be string" })
    @ArrayNotEmpty()
    skills: string[]
}
