import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Workbook } from 'exceljs';
import * as fs from 'fs';
import { format } from 'date-fns';
import { PDFDocument, rgb } from 'pdf-lib';
import { IAppConfig } from 'src/_grobal_config/interfaces';
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly config: ConfigService<IAppConfig>,
    @InjectQueue('mailQueue') private readonly mailQueue: Queue,
  ) {}

  async generateAttendanceReport() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');
    let rowNum = 1;

    worksheet.columns = [
      { header: 'Number', key: 'id', width: 10 },
      { header: 'Full Name', key: 'fullName', width: 30 },
      { header: 'Arrival Time', key: 'arrivalTime', width: 30 },
      { header: 'Leave Time', key: 'leaveTime', width: 30 },
    ];

    const attendances = await this.attendanceRepository.find();

    for (const attendance of attendances) {
      const employee = await this.employeeRepository.findOne({
        where: { user: attendance.user },
      });

      if (employee) {
        worksheet.addRow({
          id: rowNum,
          fullName: `${employee.first_name} ${employee.last_name}`,
          arrivalTime: format(
            new Date(attendance.arrival_time),
            'yyyy-MM-dd:HH:mm',
          ),
          leaveTime: attendance.leave_time
            ? format(new Date(attendance.leave_time), 'yyyy-MM-dd:HH:mm')
            : '',
        });
      }
      rowNum++;
    }

    const filename = `report-excel-${Date.now()}`;

    return {
      workbook,
      filename,
    };
  }

  async generateAttendanceReportPDF() {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    const title = 'Attendance Report';
    page.drawText(title, {
      x: 50,
      y: 370,
      size: 24,
      color: rgb(0, 0, 0),
    });

    const headers = [
      'Number',
      'Full Name',
      'Arrival Time',
      'Leave Time',
    ];
    const startY = 340;
    const rowHeight = 20;
    let rowNum = 1;

    const columnWidths = [50, 70, 120, 150, 150];

    headers.forEach((header, index) => {
      page.drawText(header, {
        x: 50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        y: startY,
        size: 14,
        color: rgb(0, 0, 0),
      });
    });

const attendances = await this.attendanceRepository.find();
let currentY = startY - rowHeight;

for (const attendance of attendances) {
  const employee = await this.employeeRepository.findOne({
    where: { user: attendance.user },
  });

  if (employee) {

    const rowData = [
        rowNum.toString(),
      `${employee.first_name} ${employee.last_name}`,
      format(new Date(attendance.arrival_time), 'yyyy-MM-dd:HH:mm'),
      attendance.leave_time
        ? format(new Date(attendance.leave_time), 'yyyy-MM-dd:HH:mm')
        : 'N/A',
    ];

    rowData.forEach((data, index) => {
      page.drawText(data, {
        x: 50 + columnWidths.slice(0, index).reduce((a, b) => a + b, 0),
        y: currentY,
        size: 12,
        color: rgb(0, 0, 0),
      });
    });

    currentY -= rowHeight;
    rowNum++;
  }
}

    const pdfBytes = await pdfDoc.save();
    const filename = `attendance_report_${Date.now()}.pdf`;

    fs.writeFileSync(filename, pdfBytes);

    return {
      filename,
    };
  }
}
