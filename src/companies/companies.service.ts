import { Injectable, Query } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schemas/company.schemas';
import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { IUsers } from 'src/users/users.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {

  constructor(@InjectModel(Company.name) private companyModal: SoftDeleteModel<CompanyDocument>) { }

  create(createCompanyDto: CreateCompanyDto, user: IUsers) {
    const compnayDTO = {
      name: createCompanyDto.name,
      address: createCompanyDto.address,
      description: createCompanyDto.description,
      createdBy: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    }
    let company = this.companyModal.create(compnayDTO)
    return company;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    let offset = (currentPage - 1) * limit;
    let defaultLimit = limit ? limit : 10;

    const totalItems = (await this.companyModal.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit)

    const result = await this.companyModal.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

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

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUsers) {
    return await this.companyModal.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      });
  }

  async remove(id: string, user: IUsers,) {
    if (!mongoose.isValidObjectId(id)) {
      return "Id not found"
    }
    return await this.companyModal.softDelete({
      _id: id,
    });
  }
}
