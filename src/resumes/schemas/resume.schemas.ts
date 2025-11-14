import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schemas';
import { Job } from 'src/jobs/schemas/job.schemas';
import { User } from 'src/users/schemas/usesr.schema';

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true }) // Truyền timestamps để tự động thêm createdAt và updatedAt
export class Resume {

    @Prop()
    email: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string

    @Prop()
    status: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Company.name })
    company: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Job.name })
    job: mongoose.Schema.Types.ObjectId

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string
        updatedAt: Date,
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId,
            name: string
        }
    }[]

    @Prop()
    isDeleted: boolean;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deletedAt: Date

    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId, email: string
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId, email: string
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId, email: string
    }
}

export const resumeSchema = SchemaFactory.createForClass(Resume);