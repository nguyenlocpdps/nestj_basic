import { IsArray, IsMongoId, IsNotEmpty, IsString } from "class-validator"

export class CreateRoleDto {
    @IsNotEmpty({ message: 'Name is not empty' })
    name: string

    @IsNotEmpty({ message: 'Description Path is not empty' })
    description: string

    @IsNotEmpty()
    isActive: boolean

    @IsArray({ message: 'Permission must be string' })
    @IsNotEmpty({ message: 'Permissions is not empty' })
    @IsMongoId({ each: true })
    permissions: string[]
}
