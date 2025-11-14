import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/usesr.schema';
import { Role, RoleSchema } from 'src/roles/schemas/role.schemas';
import { Permission, PermissionSchema } from 'src/permissions/schemas/permission.schemas';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema }
    ])],
  controllers: [DatabasesController],
  providers: [DatabasesService, UsersService],
})
export class DatabasesModule { }
