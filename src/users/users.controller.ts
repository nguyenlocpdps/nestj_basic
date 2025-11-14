import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res } from '@nestjs/common';
import { CreateUsesrDto } from './dto/create-usesr.dto';
import { UpdateUsesrDto } from './dto/update-usesr.dto';
import { UsersService } from './users.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUsers } from './users.interface';
import { ApiTags } from '@nestjs/swagger';

ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("User created successfully")
  create(@Body() createUserDTO: CreateUsesrDto, @User() user: IUsers)//lấy giá trị khi người dùng nhập vào
  {
    return this.usersService.create(createUserDTO, user)
  }

  @Get()
  @ResponseMessage("Get users successfully")
  findAll(
    @Query("current") currentPage: number,
    @Query("pageSize") limit: number,
    @Query() qs: string) {
    return this.usersService.findAll(currentPage, limit, qs);
  }

  @Public()
  @Get('profile/:id')
  @ResponseMessage("Get user successfully")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage("User updated successfully")
  update(@Body() updateUsesrDto: UpdateUsesrDto, @User() user: IUsers) {
    return this.usersService.update(updateUsesrDto, user);
  }

  @Delete('/:id')
  @ResponseMessage("User deleted successfully")
  remove(@Param('id') id: string, @User() user: IUsers) {
    return this.usersService.remove(id, user);
  }
}
