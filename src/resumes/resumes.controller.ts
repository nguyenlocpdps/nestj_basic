import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUsers } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Create resume successfully')
  create(@Body() createResumeDto: CreateResumeDto, @User() user: IUsers) {
    return this.resumesService.create(createResumeDto, user);
  }

  @Public()
  @Get('fetch-all')
  @ResponseMessage('Fetch data by pagination successfully')
  findAll(@Query("current") current: number, @Query('pageSize') pageSize: number, @Query() qs: string) {
    return this.resumesService.findAll(current, pageSize, qs);
  }

  @Get('fetch-one/:id')
  @ResponseMessage('Fetch one resume successfully')
  findOne(@Param('id') id: string) {
    return this.resumesService.findOne(id);
  }

  @Get('by-user')
  @ResponseMessage('Fetch resumes by User successfully')
  findResumesByUser(@User() user: IUsers) {
    return this.resumesService.fetchResumesByUser(user)
  }

  @Patch(':id')
  @ResponseMessage('Update resume successfully')
  update(@Param('id') id: string, @Body() updateResumeDto: UpdateResumeDto, @User() user: IUsers) {
    return this.resumesService.update(id, updateResumeDto, user);
  }

  @ResponseMessage('Delete resume successfully')
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUsers) {
    return this.resumesService.remove(id, user);
  }
}
