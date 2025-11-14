import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUsers } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument, PermissionSchema } from './schemas/permission.schemas';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId } from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class PermissionsService {

  constructor(@InjectModel(Permission.name) private permissionModal: SoftDeleteModel<PermissionDocument>) { }

  async create(createPermissionDto: CreatePermissionDto, user: IUsers) {
    const existingPermission = await this.permissionModal.findOne({
      apiPath: createPermissionDto.apiPath,
      method: createPermissionDto.method,
    })

    if (existingPermission) {
      if (existingPermission.isDeleted === true) {
        await this.permissionModal.updateOne(
          { _id: existingPermission._id },
          {
            ...createPermissionDto,
            isDeleted: false,
            deletedBy: null
          }
        )
        return {
          _id: existingPermission._id,
          createdAt: existingPermission.createdAt,
        }
      } else {
        throw new BadRequestException('Permission already existing')
      }
    } else {
      const newPermission = await this.permissionModal.create({
        ...createPermissionDto,
        createdBy: {
          _id: user._id,
          name: user.name
        }
      })
      return {
        _id: newPermission._id,
        createdAt: newPermission.createdAt,
      }
    }

  }

  async findAll(current: number, pageSize: number, qs: string) {
    const { filter, sort } = aqp(qs)
    delete filter.current
    delete filter.pageSize

    const defaultPageSize = pageSize ? pageSize : 5
    const offset = (current - 1) * pageSize

    const totalItems = await this.permissionModal.countDocuments(filter).exec()
    const totalPages = Math.ceil(totalItems / defaultPageSize)

    const result = await this.permissionModal
      .find(filter)
      .skip(offset)
      .limit(defaultPageSize)
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
    }
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id is invalid')
    }
    return await this.permissionModal.findById({ _id: id })
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUsers) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Id is invalid')
    }

    return this.permissionModal.updateOne({
      _id: id
    }, {
      ...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        name: user.name
      }
    })
  }

  async remove(id: string, user: IUsers) {
    await this.permissionModal.updateOne({
      _id: id
    }, {
      deletedBy: {
        _id: user._id,
        name: user.name
      }
    })

    return this.permissionModal.softDelete({ _id: id })
  }
}
