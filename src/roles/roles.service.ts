import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { IUsers } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schemas/role.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId } from 'mongoose';
import aqp from 'api-query-params';
import { ADMIN_ROLE } from 'src/databases/sample';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModal: SoftDeleteModel<RoleDocument>) { }

  async create(createRoleDto: CreateRoleDto, user: IUsers) {
    const existingRole = await this.roleModal.findOne({
      name: createRoleDto.name
    })

    if (existingRole) {
      if (existingRole.isDeleted === true) {
        await this.roleModal.updateOne({
          name: createRoleDto.name
        }, {
          ...createRoleDto,
          isDeleted: false,
          deletedBy: null,
          createdAt: new Date,
          createdBy: {
            _id: user._id,
            name: user.name
          }
        })

        return {
          _id: existingRole._id,
          createdAt: new Date,
          createdBy: {
            _id: user._id,
            name: user.name
          }
        }
      } else {
        throw new BadRequestException('Role is already existing')
      }
    }

    const role = await this.roleModal.create(createRoleDto)
    return {
      _id: role._id,
      createdAt: role.createdAt,
      createdBy: {
        _id: user._id,
        name: user.name
      }
    }
  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const defaultPageSize = pageSize ? pageSize : 5
    const offset = (current - 1) * pageSize

    const totalItems = await this.roleModal.countDocuments(filter).exec()
    const totalPages = Math.ceil(totalItems / defaultPageSize)

    const result = await this.roleModal
      .find(filter)
      .skip(offset)
      .sort(sort as any)
      .select(projection)
      .populate({ path: 'permissions', select: '_id name apiPath' })
      .exec()

    return {
      meta: {
        current: current,
        pageSize: defaultPageSize,
        totalPages: totalPages,
        totals: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Is is invalid')
    return await this.roleModal.findOne({
      _id: id
    }).populate({ path: 'permissions', select: { _id: 1, name: 1, apiPath: 1, module: 1, method: 1 } })
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUsers) {
    if (!isValidObjectId(id)) throw new BadRequestException('Id is invalid')

    return this.roleModal.updateOne({
      _id: id
    }, {
      ...updateRoleDto,
      updatedBy: {
        _id: user._id,
        name: user.name
      }
    })
  }

  async remove(id: string, user: IUsers) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id is invalid')
    }

    const role = await this.roleModal.findById({ _id: id })
    if (role.name === ADMIN_ROLE) {
      throw new BadRequestException("Can't delete role Admin")
    }

    await this.roleModal.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        name: user.name
      }
    })

    return this.roleModal.softDelete({ _id: id });
  }

}
