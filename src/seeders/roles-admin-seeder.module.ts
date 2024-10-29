import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSeederService } from './roles-admin-seeder.service';
import { Role } from '../auth/entities/role.entity';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User])],
  providers: [RoleSeederService],
  exports: [RoleSeederService],
})
export class RoleSeederModule {}
