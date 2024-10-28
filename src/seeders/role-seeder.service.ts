import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../auth/entities/role.entity';
import { Role as RoleEnum } from '../auth/enum/role.enum';

@Injectable()
export class RoleSeederService implements OnModuleInit {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
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

  async onModuleInit() {
    await this.seedRoles();
  }
}
