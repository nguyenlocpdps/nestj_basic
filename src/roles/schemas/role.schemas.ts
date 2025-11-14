import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Mongoose, Types } from 'mongoose';
import { Company } from 'src/companies/schemas/company.schemas';
import { Job } from 'src/jobs/schemas/job.schemas';
import { Permission } from 'src/permissions/schemas/permission.schemas';
import { User } from 'src/users/schemas/usesr.schema';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true }) // Truyền timestamps để tự động thêm createdAt và updatedAt
export class Role {

    @Prop()
    name: string;

    @Prop()
    description: string

    @Prop()
    isActive: boolean

    @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: Permission.name })
    permissions: Permission[]

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

export const RoleSchema = SchemaFactory.createForClass(Role);