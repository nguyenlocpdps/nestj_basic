import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';
import { Role } from 'src/roles/schemas/role.schemas';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true }) // Truyền timestamps để tự động thêm createdAt và updatedAt
export class User {

  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ type: Object })
  company: {
    _id: mongoose.Schema.Types.ObjectId, name: string
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Role.name })
  role: string

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  isDeleted: boolean;

  @Prop()
  refreshToken: string;

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

export const UserSchema = SchemaFactory.createForClass(User);