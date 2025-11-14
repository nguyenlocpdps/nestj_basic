import { BadRequestException, Injectable, Query } from '@nestjs/common';
import { CreateUsesrDto } from './dto/create-usesr.dto';
import { UpdateUsesrDto } from './dto/update-usesr.dto';
import { User, UserDocument } from './schemas/usesr.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { genSaltSync, hashSync, compareSync } from "bcrypt";
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUsers } from './users.interface';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name) private userModal: SoftDeleteModel<UserDocument>,


  ) { } //injectModal 

  hashPassword = (password: string) => {
    const saltRounds = 10
    const salt = genSaltSync(saltRounds);
    const hash = hashSync(password, salt);
    return hash
  }

  async create(createUserDTO: CreateUsesrDto, userInfo: IUsers) {
    const isExist = await this.userModal.findOne({ email: createUserDTO.email })
    if (isExist) {
      throw new BadRequestException(`Email ${createUserDTO.email} is already registered`)
    }
    const userDTO = {
      name: createUserDTO.name,
      email: createUserDTO.email,
      password: this.hashPassword(createUserDTO.password),
      age: createUserDTO.age,
      role: createUserDTO.role,
      gender: createUserDTO.gender,
      address: createUserDTO.address,
      company: createUserDTO.company,
    }
    const user = await this.userModal.create(userDTO)
    return {
      _id: user?._id,
      createdAt: user?.createdAt,
      createdBy: {
        _id: userInfo._id,
        name: userInfo.name,
        email: userInfo.email
      }
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    
    delete filter.current;
    delete filter.pageSize;

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 10;

    const totalItems = await this.userModal.countDocuments(filter).exec();
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.userModal.
      find(filter).
      skip(offset).
      limit(defaultLimit).
      sort(sort as any).
      populate(population).
      select('-password').
      exec();

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        total: totalItems,
        pages: totalPages
      },
      result
    }
  }

  async findOne(id: string) {
    if (!mongoose.isValidObjectId(id)) {
      return "Id not found"
    }

    let user = await this.userModal.findById({
      _id: id
    }).select('-password')

    return user;
  }

  async findOneByUsername(username: string) {
    let user = await this.userModal.findOne({
      email: username
    }).populate({ path: "role", select: { name: 1 } })
    return user;
  }

  async update(updateUsesrDto: UpdateUsesrDto, userInfo: IUsers) {
    const userUpdate = await this.userModal.updateOne(
      { _id: updateUsesrDto._id },
      {
        ...updateUsesrDto,
        updatedBy: {
          _id: userInfo._id,
          email: userInfo.email,
          name: userInfo.name
        }
      }, {

    });
    return userUpdate
  }

  async remove(id: string, userInfo: IUsers) {
    if (!mongoose.isValidObjectId(id)) {
      throw new BadRequestException("Id not found")
    }

    if (userInfo.email === ADMIN_ROLE) {
      throw new BadRequestException("can not delete email admin")
    }

    await this.userModal.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: userInfo._id,
        email: userInfo.email,
        name: userInfo.name
      }
    })
    return await this.userModal.softDelete({ _id: id })
  }

  findUserByToken = async (refreshToken: string) => {
    return await this.userModal.findOne({ refreshToken }).populate({
      path: "role",
      select: { name: 1 }
    })
  }

  async isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword)
  }
}
