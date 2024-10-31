import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from 'src/reports/reports.controller';
import { ReportsService } from 'src/reports/reports.service';
import { Response } from 'express';
import { AdminGuard } from 'src/auth/guard/isAdmin.guard';
import { Role } from 'src/auth/entities/role.entity';
import { Repository } from 'typeorm';
import { Reflector } from '@nestjs/core';
import { Role as ERoles } from 'src/auth/enum/role.enum';
import * as fs from 'fs';

describe('ReportsController', () => {
  let reportsController: ReportsController;
  let reportsService: ReportsService;
  let roleRepository: Repository<Role>;

  const mockReportsService = {
    generateExcelAttendanceReport: jest.fn(),
    generatePdfAttendanceReport: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockReflector = {
    getAllAndOverride: jest.fn().mockReturnValue(true), 
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockReportsService,
        },
        {
          provide: 'RoleRepository',
          useValue: mockRoleRepository, 
        },
        {
          provide: Reflector,
          useValue: mockReflector, 
        },
        AdminGuard,
      ],
    }).compile();

    reportsController = module.get<ReportsController>(ReportsController);
    reportsService = module.get<ReportsService>(ReportsService);
    roleRepository = module.get<Repository<Role>>('RoleRepository');
  });

  describe('downloadExcel', () => {
    it('should return an Excel file', async () => {
      const mockWorkbook = {
        xlsx: {
          write: jest.fn().mockReturnValue(Promise.resolve()),
        },
      };
      const mockResponse: Response = {
        set: jest.fn(),
        end: jest.fn(),
      } as unknown as Response;

      mockReportsService.generateExcelAttendanceReport.mockResolvedValue({
        workbook: mockWorkbook,
        filename: 'attendance_report',
      });

      mockRoleRepository.findOne.mockResolvedValue({
        id: 1,
        name: ERoles.ADMIN,
      });

      await reportsController.downloadExcel(mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename=attendance_report.xlsx',
      });
      expect(mockWorkbook.xlsx.write).toHaveBeenCalledWith(mockResponse);
      expect(mockResponse.end).toHaveBeenCalled();
    });
  });

  describe('downloadPdf', () => {
    it('should return a PDF file', async () => {
      const mockResponse: Response = {
        set: jest.fn(),
        pipe: jest.fn(),
      } as unknown as Response;

      mockReportsService.generatePdfAttendanceReport.mockResolvedValue({
        filename: 'attendance_report.pdf',
      });

      const filePath = `./attendance_report.pdf`;
      const mockFileStream = {
        pipe: jest.fn(),
      };

      jest.spyOn(fs, 'createReadStream').mockReturnValue(mockFileStream as any);

      mockRoleRepository.findOne.mockResolvedValue({
        id: 1,
        name: ERoles.ADMIN,
      });

      await reportsController.downloadPdf(mockResponse);

      expect(mockResponse.set).toHaveBeenCalledWith({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=attendance_report.pdf',
      });
      expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
      expect(mockFileStream.pipe).toHaveBeenCalledWith(mockResponse);
    });
  });
});
