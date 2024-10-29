import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from 'src/auth/entities/user.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IAppConfig } from 'src/_grobal_config/interfaces';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Attendance)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private readonly employeeRepository: Repository<Employee>,
    @InjectQueue('mailQueue') private readonly mailQueue: Queue,
    private readonly config: ConfigService<IAppConfig>,
  ) {}

  async recordArrival(user: number): Promise<Attendance> {
    const newAttendance = this.attendanceRepository.create({
      user,
    });

    const recipient = await this.userRepository.findOne({
      where: { id: user },
    });
    const employee = await this.employeeRepository.findOne({
      where: { user: recipient.id },
    });
    await this.mailQueue.add('sendEmail', {
      email: `${recipient.email}`,
      subject: 'Entry Attendance recorded',
      from: `"No Reply" <${this.config.get('mail').from}>`,
      context: {
        username: `${employee.first_name} ${employee.last_name}`,
      },
      template: './default.template.hbs',
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

    const recipient = await this.userRepository.findOne({
      where: { id: user },
    });
    const employee = await this.employeeRepository.findOne({
      where: { user: recipient.id },
    });
    await this.mailQueue.add('sendEmail', {
      email: `${recipient.email}`,
      subject: 'Exit Attendance recorded',
      from: `"No Reply" <${this.config.get('mail').from}>`,
      context: {
        username: `${employee.first_name} ${employee.last_name}`,
      },
      template: './default.template.hbs',
    });

    return await this.attendanceRepository.save(attendanceRecord);
  }
}
