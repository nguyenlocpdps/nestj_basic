import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUsers } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @ResponseMessage("Job created successfully")
  @Post()
  create(@Body() createJobDto: CreateJobDto, @User() user: IUsers) {
    return this.jobsService.create(createJobDto, user);
  }

  @Public()
  @ResponseMessage("Fetch jobs with pagination")
  @Get()
  findAll(
    @Query('current') currentPage: number,
    @Query('pageSize') limit: number,
    @Query() qs: string) {
    return this.jobsService.findAll(currentPage, limit, qs);
  }

  @Public()
  @ResponseMessage("Get job successfully")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(id);
  }

  @ResponseMessage("Job updated successfully")
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto, @User() user: IUsers) {
    return this.jobsService.update(id, updateJobDto, user);
  }

  @ResponseMessage("Job deleted successfully")
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUsers) {
    return this.jobsService.remove(id, user);
  }
}
