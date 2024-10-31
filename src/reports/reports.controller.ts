import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import * as fs from 'fs';
import { AdminGuard } from 'src/auth/guard/isAdmin.guard';
import { IsAdmin } from 'src/auth/decorators';

@Controller('reports')
@ApiTags('Reports')
@UseGuards(JwtGuard, AdminGuard)
@IsAdmin()
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class ReportsController {
  constructor(private readonly ReportsService: ReportsService) {}

  @Get('export/excel')
  async downloadExcel(@Res() res: Response) {
    const { workbook, filename } =
      await this.ReportsService .generateExcelAttendanceReport();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=${filename}.xlsx`,
    });
    workbook.xlsx.write(res).then(() => res.end());
  }
  @Get('export/pdf')
  async downloadPdf(@Res() res: Response) {
    const { filename } =
      await this.ReportsService .generatePdfAttendanceReport();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    const filePath = `./${filename}`;
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
