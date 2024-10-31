import { Module } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { User } from 'src/auth/entities/user.entity';
import { Role } from 'src/auth/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Employee, User, Role]),
    ConfigModule,
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
})
export class EmployeesModule {}
