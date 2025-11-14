import { Module } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Company, CompanySchema } from './schemas/company.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Company.name, schema: CompanySchema }])], //khai báo mongo để tính năng biết sự tồn tại của Mongo
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [CompaniesService]
})
export class CompaniesModule { }
