import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/auth/entities/user.entity';
import { Role as ERole } from 'src/auth/enum/role.enum';

@Injectable()
export class AdminRolesSeeder {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async seed() {
    const roles = [
      { name: ERole.ADMIN },
      { name: ERole.EMPLOYEE },
    ];

    for (const roleData of roles) {
      const roleExists = await this.roleRepository.findOne({
        where: { name: roleData.name },
      });
      if (!roleExists) {
        const role = this.roleRepository.create(roleData);
        await this.roleRepository.save(role);
      }
    }

    const adminRole = await this.roleRepository.findOne({
      where: { name: ERole.ADMIN },
    });

    if (!adminRole) {
      throw new Error("Admin role was not found; roles seeding might have failed.");
    }

    const defaultAdminEmail = 'havugapac@gmail.com';
    const existingAdmin = await this.userRepository.findOne({
      where: { email: defaultAdminEmail },
    });

    if (!existingAdmin) {
      const hashedPassword = await argon.hash('admin@123');
      const adminUser = this.userRepository.create({
        email: defaultAdminEmail,
        password: hashedPassword,
        roleId: adminRole.id,
        isActive: true,
      });

      await this.userRepository.save(adminUser);
      console.log('Default admin user seeded successfully');
    } else {
      console.log('Default admin user already exists');
    }
  }
}