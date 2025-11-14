import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Resume, resumeSchema } from './schemas/resume.schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Resume.name, schema: resumeSchema }])],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService]
})
export class ResumesModule { }
