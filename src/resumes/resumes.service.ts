import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Resume, ResumeDocument } from './schemas/resume.schemas';
import { IUsers } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { isValidObjectId } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ResumesService {
  constructor(@InjectModel(Resume.name) private resumeModal: SoftDeleteModel<ResumeDocument>) { }

  async create(createResumeDto: CreateResumeDto, user: IUsers) {
    const resume = {
      email: user.email,
      userId: user._id,
      url: createResumeDto.url,
      status: createResumeDto.status,
      company: createResumeDto.company,
      job: createResumeDto.job,
      history: [
        {
          status: createResumeDto.status,
          updatedAt: new Date,
          updatedBy: {
            _id: user._id,
            email: user.email
          }
        }
      ],
      createdBy: {
        _id: user._id,
        email: user.email
      }
    }
    const result = await this.resumeModal.create(resume)
    return {
      _id: result._id,
      createdAt: result.createdAt
    }
  }

  async findAll(current: number, limit: number, qs: string) {
    const { filter, sort, projection } = aqp(qs);

    delete filter.current
    delete filter.pageSize

    const offset = (current - 1) * limit
    const pageSize = limit ? limit : 5

    const totalItems = await this.resumeModal.countDocuments(filter).exec()
    const totalPages = Math.ceil(totalItems / pageSize)

    const result = await this.resumeModal
      .find(filter)
      .limit(pageSize)
      .skip(offset)
      .sort(sort as any)
      .select(projection)
      .populate([
        { path: 'company', select: '_id name' },
        { path: 'job', select: '_id name' },
        // { path: 'userId', select: '_id name' }
      ])
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

  findOne(id: string) {
    return this.resumeModal.findById({ _id: id });
  }

  fetchResumesByUser = async (user: IUsers) => {
    return this.resumeModal.find({
      userId: user._id
    })
  }

  async update(id: string, updateResumeDto: UpdateResumeDto, user: IUsers) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Resume is invalid")
    } else {
      const result = await this.resumeModal.updateOne(
        { _id: id },
        {
          ...updateResumeDto,
          email: user.email,
          userId: user._id,
          $push: {
            history: {
              status: updateResumeDto.status,
              updatedAt: new Date,
              updatedBy: {
                _id: user._id,
                email: user.email
              }
            }
          },
          updatedBy: {
            _id: user._id,
            name: user.name
          }
        })

      return result;
    }
  }

  remove(id: string, user: IUsers) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Id is invalid")
    }
    this.resumeModal.updateOne({ _id: id }, {
      deletedBy: {
        _id: user._id,
        name: user.name
      }
    })
    return this.resumeModal.softDelete({
      _id: id
    })
  }
}
