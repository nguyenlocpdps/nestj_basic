import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { IUsers } from 'src/users/users.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Job, JobDocument, JobSchema } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(@InjectModel(Job.name) private jobModal: SoftDeleteModel<JobDocument>) { }

  async create(createJobDto: CreateJobDto, user: IUsers) {
    const existsJob = await this.jobModal.findOne({ name: createJobDto.name })
    if (!existsJob) {
      if (createJobDto.endDate < createJobDto.startDate) {
        throw new BadRequestException('Start date must be less than End date')
      }
      const result = await this.jobModal.create(createJobDto);
      return {
        _id: result._id,
        createdAt: result.createdAt,
        createdBy: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }
    } else {
      throw new BadRequestException('Existing Company Name')
    }
  }

  async findAll(current: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    if (filter.salary) {
      const num = filter.salary
      filter.salary = parseInt(num.toString().match(/\d+/)[0], 10);
    }

    const offset = (current - 1) * limit
    const pageSize = limit ? limit : 5

    const totalItems = await this.jobModal.countDocuments(filter).exec()
    const totalPages = Math.ceil(totalItems / pageSize)

    const result = await this.jobModal
      .find(filter)
      .skip(offset)
      .limit(pageSize)
      .sort(sort as any)
      .populate(population)
      .exec()

    return {
      meta: {
        current: current,
        pageSize: pageSize,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    const result = await this.jobModal.findOne({ _id: id }).exec();
    return result;
  }

  update(id: string, updateJobDto: UpdateJobDto, user: IUsers) {
    return this.jobModal.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      }).exec();
  }

  remove(id: string, user: IUsers) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Invalid Job ID")
    }
    this.jobModal.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }).exec();
    return this.jobModal.softDelete(
      { _id: id })
  }
}
