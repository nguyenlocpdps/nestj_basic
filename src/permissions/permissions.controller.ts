import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUsers } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('permissions')
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @ResponseMessage('Create Permission successfully')
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUsers) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @ResponseMessage('Fetch all permisison successfully')
  @Get()
  findAll(@Query('current') current: number, @Query('pageSize') pageSize: number, qs: string) {
    return this.permissionsService.findAll(current, pageSize, qs);
  }

  @ResponseMessage('Fetch permisison successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(id);
  }
  @ResponseMessage('Update permisison successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto, @User() user: IUsers) {
    return this.permissionsService.update(id, updatePermissionDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUsers) {
    return this.permissionsService.remove(id, user);
  }
}
