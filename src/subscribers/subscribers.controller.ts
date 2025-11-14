import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUsers } from 'src/users/users.interface';
import { ApiTags } from '@nestjs/swagger';


ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) { }

  @Post()
  @ResponseMessage("Create Subscriber successfully")
  create(@Body() createSubscriberDto: CreateSubscriberDto, @User() user: IUsers) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @ResponseMessage("Fetch all subscribers successfully")
  @Get()
  findAll(@Query('current') current: number, @Query('pageSize') pageSize: number, qs: string) {
    return this.subscribersService.findAll(current, pageSize, qs);
  }

  @ResponseMessage("Fetch subscriber successfully")
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscribersService.findOne(id);
  }

  @ResponseMessage("Update Subscriber successfully")
  @SkipCheckPermission()
  @Patch()
  update(@Body() updateSubscriberDto: UpdateSubscriberDto, @User() user: IUsers) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @ResponseMessage("Remove Subscriber successfully")
  @Delete(':id')
  remove(@Param('id') id: string, user: IUsers) {
    return this.subscribersService.remove(id,user);
  }

  @ResponseMessage('Get Skills by User Successfully')
  @SkipCheckPermission()
  @Post('skills')
  getSkillByUserEmail(@User() user: IUsers){
    return this.subscribersService.getSkills(user)
  }
}
