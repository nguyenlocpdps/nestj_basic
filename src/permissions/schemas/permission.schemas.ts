import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schemas';
import { Job } from 'src/jobs/schemas/job.schemas';
import { User } from 'src/users/schemas/usesr.schema';

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({ timestamps: true }) // Truyền timestamps để tự động thêm createdAt và updatedAt
export class Permission {

    @Prop()
    name: string;

    @Prop()
    apiPath: string

    @Prop()
    method: string

    @Prop()
    module: string

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

export const PermissionSchema = SchemaFactory.createForClass(Permission);