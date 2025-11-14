import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUsers } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @ResponseMessage('Create role successfully')
  @Post()
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUsers) {
    return this.rolesService.create(createRoleDto, user);
  }

  @ResponseMessage('Fetch all roles with pagination')
  @Get()
  findAll(@Query('current') current: number, @Query('pageSize') pageSize: number, qs: string) {
    return this.rolesService.findAll(current, pageSize, qs);
  }

  @ResponseMessage('Fetch Role successfully')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @ResponseMessage('Update role successfully')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto, @User() user: IUsers) {
    return this.rolesService.update(id, updateRoleDto, user);
  }

  @ResponseMessage('Delete role successfully')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUsers) {
    return this.rolesService.remove(id, user);
  }
}
