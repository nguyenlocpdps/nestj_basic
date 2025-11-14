import { IsNotEmpty } from "class-validator"

export class CreatePermissionDto {
    @IsNotEmpty({ message: 'Name is not empty' })
    name: string

    @IsNotEmpty({ message: 'api Path is not empty' })
    apiPath: string

    @IsNotEmpty({ message: 'Method is not empty' })
    method: string

    @IsNotEmpty({ message: 'Module is not empty' })
    module: string
}
