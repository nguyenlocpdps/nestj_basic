import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { IUsers } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schemas/subscriber.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()

export class SubscribersService {
  constructor(@InjectModel(Subscriber.name) private subscrModel: SoftDeleteModel<SubscriberDocument>) { }

  async create(createSubscriberDto: CreateSubscriberDto, user: IUsers) {
    const isExist = await this.subscrModel.findOne({ email: createSubscriberDto.email })
    if (isExist) {
      throw new BadRequestException("Subscriber is ready existing")
    }
    const result = await this.subscrModel.create({
      ...createSubscriberDto,
      createdBy: {
        _id: user._id,
        name: user.name
      }
    })
    return {
      _id: result.id,
      createdAt: result.createdAt
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const {filter, sort} = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const offset = (current -1 ) * pageSize
    const defaultPageSize = pageSize ? pageSize : 5

    const totalItems = await this.subscrModel.countDocuments(filter).exec()
    const totalPages = Math.ceil(totalItems / defaultPageSize)

    const result = await this.subscrModel
    .find(filter)
    .skip(offset)
    .sort(sort as any)
    .exec()

    return {
      meta: {
        current: current,
        pageSize: defaultPageSize,
        totalItems,
        totalPages
      },
      result
    };
  }

  findOne(id: string) {
    if(!isValidObjectId(id)) throw new BadRequestException('Id is invalid')
    return this.subscrModel.findById({_id: id})
  }

  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUsers) {
    return await this.subscrModel.updateOne({
      email: user.email
    }, {
      ...updateSubscriberDto,
      updatedBy:{
        _id: user._id,
        name: user.name
      },
    
    },{
      upsert:true
    })
  }

  async remove(id: string, user:IUsers) {
    if(!isValidObjectId(id)) throw new BadRequestException('Id is invalid')

    this.subscrModel.updateOne({
      _id: id
    },{
      deletedBy:{
        _id: user._id,
        name: user.name
      }
    })
    return this.subscrModel.softDelete({_id: id});
  }

  async getSkills(user:IUsers) {
    return this.subscrModel.findOne({email: user.email}, {skills:1})
  }
}
