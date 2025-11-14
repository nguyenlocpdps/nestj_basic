import { IsMongoId, IsNotEmpty } from "class-validator"
import mongoose from "mongoose"

export class CreateResumeDto {
    @IsNotEmpty({ message: "Url is not empty" })
    url: string

    @IsMongoId()
    @IsNotEmpty({ message: "Company  is not empty" })
    company: mongoose.Schema.Types.ObjectId

    @IsMongoId()
    @IsNotEmpty({ message: "Job  is not empty" })
    job: string

    @IsNotEmpty({ message: "Status is not empty" })
    status: string
}
