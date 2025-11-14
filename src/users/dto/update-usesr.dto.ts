import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUsesrDto } from './create-usesr.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUsesrDto extends OmitType(CreateUsesrDto, ['password'] as const) {
    @IsNotEmpty({ message: "Id is require" })
    _id: string
}
