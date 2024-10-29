import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { ReportsController } from './reports.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance, Employee]),
    ConfigModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
