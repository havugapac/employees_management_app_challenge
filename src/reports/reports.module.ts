import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { ReportsController } from './reports.controller';
import { Role } from 'src/auth/entities/role.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Employee, Role]),
    ConfigModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
