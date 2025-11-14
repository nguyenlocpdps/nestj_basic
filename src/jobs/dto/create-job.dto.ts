import { Transform, Type } from "class-transformer"
import { ArrayNotEmpty, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, MinDate, Validate, ValidateNested } from "class-validator"
import mongoose from "mongoose"
import { EndDateAfterStartDate } from "src/validators/endDateAfterStartDate"
class Company {
    @IsNotEmpty()
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty()
    name: string
}

export class CreateJobDto {
    @IsNotEmpty({ message: "Name is not empty" })
    name: string

    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true, message: "sKill must be is String" })
    skills: string[]

    @IsNotEmpty({ message: "Location is not empty" })
    location: string

    @IsNotEmpty({ message: "Quantity is not empty" })
    quantity: string

    @IsNotEmpty({ message: "Level is not empty" })
    level: string

    @IsNotEmpty({ message: "Description  is not empty" })
    description: string

    // @IsNotEmpty({ message: "Logo is not empty" })
    logo: string

    @IsNotEmpty({ message: "Start date  is not empty" })
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @Type(() => Date)
    startDate: Date

    @IsNotEmpty({ message: "End date  is not empty" })
    @Transform(({ value }) => new Date(value))
    @IsDate()
    @Type(() => Date)
    endDate: Date

    @IsBoolean()
    isActive: boolean

    @IsNotEmptyObject()
    @ValidateNested()
    @IsObject()
    @Type(() => Company)
    company: Company
}

