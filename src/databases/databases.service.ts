import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Permission, PermissionDocument } from 'src/permissions/schemas/permission.schemas';
import { Role, RoleDocument } from 'src/roles/schemas/role.schemas';
import { User, UserDocument } from 'src/users/schemas/usesr.schema';
import { UsersService } from 'src/users/users.service';
import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from './sample';

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name)
    constructor(
        @InjectModel(User.name)
        private userModal: SoftDeleteModel<UserDocument>,

        @InjectModel(Role.name)
        private roleModal: SoftDeleteModel<RoleDocument>,

        @InjectModel(Permission.name)
        private permissionModal: SoftDeleteModel<PermissionDocument>,

        private configServices: ConfigService,
        private userServices: UsersService

    ) { }
    async onModuleInit() {
        const isInit = this.configServices.get<string>("SHOULD_INIT");
        if (Boolean(isInit)) {

            const countUser = await this.userModal.countDocuments({});
            const countPermission = await this.permissionModal.countDocuments({});
            const countRole = await this.roleModal.countDocuments({});

            //create permissions
            if (countPermission === 0) {
                await this.permissionModal.insertMany(INIT_PERMISSIONS);
                //bulk create
            }

            // create role
            if (countRole === 0) {
                const permissions = await this.permissionModal.find({}).select("_id");
                await this.roleModal.insertMany([
                    {
                        name: ADMIN_ROLE,
                        description: "Admin thì full quyền :v",
                        isActive: true,
                        permissions: permissions
                    },
                    {
                        name: USER_ROLE,
                        description: "Người dùng/Ứng viên sử dụng hệ thống",
                        isActive: true,
                        permissions: [] //không set quyền, chỉ cần add ROLE
                    }
                ]);
            }

            if (countUser === 0) {
                const adminRole = await this.roleModal.findOne({ name: ADMIN_ROLE });
                const userRole = await this.roleModal.findOne({ name: USER_ROLE })
                await this.userModal.insertMany([
                    {
                        name: "I'm admin",
                        email: "admin@gmail.com",
                        password: this.userServices.hashPassword(this.configServices.get<string>("INIT_PASSWORD")),
                        age: 69,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm Hỏi Dân IT",
                        email: "hoidanit@gmail.com",
                        password: this.userServices.hashPassword(this.configServices.get<string>("INIT_PASSWORD")),
                        age: 96,
                        gender: "MALE",
                        address: "VietNam",
                        role: adminRole?._id
                    },
                    {
                        name: "I'm normal user",
                        email: "user@gmail.com",
                        password: this.userServices.hashPassword(this.configServices.get<string>("INIT_PASSWORD")),
                        age: 69,
                        gender: "MALE",
                        address: "VietNam",
                        role: userRole?._id
                    },
                ])
            }

            if (countUser > 0 && countRole > 0 && countPermission > 0) {
                this.logger.log('>>> ALREADY INIT SAMPLE DATA...');
            }
        }
    }
}
