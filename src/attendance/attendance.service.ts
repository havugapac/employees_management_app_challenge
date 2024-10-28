import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private readonly attendanceRepository: Repository<Attendance>,
      ) {}
    
      async recordArrival(user: number): Promise<Attendance> {
        const newAttendance = this.attendanceRepository.create({
          user,
        });

        return await this.attendanceRepository.save(newAttendance);
      }
    
      async recordDeparture(user: number): Promise<Attendance> {

        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        const attendanceRecord = await this.attendanceRepository.findOne({
          where: {
            user,
            arrival_time: MoreThanOrEqual(today),
          },
        });
      
        if (!attendanceRecord) {
          throw new NotFoundException(
            'No attendance record found for today with this userId.',
          );
        }
      
        attendanceRecord.leave_time = new Date();
        return await this.attendanceRepository.save(attendanceRecord);
      }
      
}
