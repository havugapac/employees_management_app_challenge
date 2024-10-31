import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from '../src/attendance/attendance.controller';
import { AttendanceService } from '../src/attendance/attendance.service';
import { User } from 'src/auth/entities/user.entity';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Employee } from '../src/employees/entities/employee.entity';

describe('AttendanceController', () => {
  let attendanceController: AttendanceController;
  let attendanceService: AttendanceService;

  const mockUser: User = {
      id: 1,
      email: 'user@example.com',
      password: 'as324',
      roleId: 1,
      isActive: true,
      role: null,
      employee: new Employee,
      attendances: [],
      verifications: null,
      created_at: new Date,
      updated_at: new Date
  };

  const mockAttendanceService = {
    recordArrival: jest.fn(),
    recordDeparture: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: mockAttendanceService,
        },
      ],
    }).compile();

    attendanceController = module.get<AttendanceController>(AttendanceController);
    attendanceService = module.get<AttendanceService>(AttendanceService);
  });

  describe('recordArrival', () => {
    it('should call attendanceService.recordArrival with user and return the result', async () => {
      const result = { message: 'Entry Attendance recorded successfully' };
      mockAttendanceService.recordArrival.mockResolvedValue(result);

      const response = await attendanceController.recordArrival(mockUser);

      expect(attendanceService.recordArrival).toHaveBeenCalledWith(mockUser);
      expect(response).toEqual(result);
    });

    it('should throw ConflictException when attendanceService.recordArrival fails', async () => {
      mockAttendanceService.recordArrival.mockRejectedValue(new ConflictException('Unable To Record Attendance'));

      await expect(attendanceController.recordArrival(mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('recordDeparture', () => {
    it('should call attendanceService.recordDeparture with user and return the result', async () => {
      const result = { message: 'Exit Attendance recorded successfully' };
      mockAttendanceService.recordDeparture.mockResolvedValue(result);

      const response = await attendanceController.recordDeparture(mockUser);

      expect(attendanceService.recordDeparture).toHaveBeenCalledWith(mockUser);
      expect(response).toEqual(result);
    });

    it('should throw NotFoundException when no attendance record is found', async () => {
      mockAttendanceService.recordDeparture.mockRejectedValue(new NotFoundException('No attendance record found for today with this userId.'));

      await expect(attendanceController.recordDeparture(mockUser)).rejects.toThrow(NotFoundException);
    });
  });
});
