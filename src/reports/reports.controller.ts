import { Controller, Get, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ReportsService } from './reports.service';
import { ApiTags, ApiBearerAuth, ApiUnauthorizedResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { AllowRoles } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import * as fs from 'fs';
import { Role as ERoles } from '../auth/enum/role.enum'

@Controller('reports')
@ApiTags('Reports')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.ADMIN)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class ReportsController {
  constructor(private readonly ReportsService: ReportsService) {}

  @Get('export/excel')
  async downloadExcel(@Res() res: Response) {
    const { workbook, filename } =
      await this.ReportsService .generateAttendanceReport();
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
      await this.ReportsService .generateAttendanceReportPDF();

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
    });

    const filePath = `./${filename}`;
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  }
}
