import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/entities/role.entity';
import { Role as RoleEnum } from '../auth/enum/role.enum';
import { User } from '../auth/entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class RoleSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seedRoles() {
    const roles = Object.values(RoleEnum) as RoleEnum[];
    for (const roleName of roles) {
      const roleExists = await this.roleRepository.findOne({ where: { name: roleName } });
      if (!roleExists) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
      }
    }
  }

  async seedAdmin() {
    const defaultAdminEmail = 'vugapac@gmail.com';

    const adminRole = await this.roleRepository.findOne({
      where: { name: RoleEnum.ADMIN },
    });

    if (!adminRole) {
      throw new Error("Admin role was not found; roles seeding might have failed.");
    }

    const existingAdmin = await this.userRepository.findOne({
      where: { email: defaultAdminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin@123', 8);
      const adminUser = this.userRepository.create({
        email: defaultAdminEmail,
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
      });

      await this.userRepository.save(adminUser);
  }
}

  async onModuleInit() {
    await this.seedRoles();
    await this.seedAdmin();
  }
}
