import { Controller, Param, Patch, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOkResponse, ApiOperation, ApiConflictResponse, ApiTags } from '@nestjs/swagger';

@Controller('attendance')
@ApiTags('Attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiOkResponse({ description: 'Attendance Recorded successfully' })
  @ApiOperation({ summary: 'Attendance | Arrival' })
  @ApiConflictResponse({ description: 'Unable To Record Attendance' })
  @Post('arrive/:id')
  async recordArrival(@Param('id') id: number) {
    return this.attendanceService.recordArrival(id);
  }

  @ApiOkResponse({ description: 'Attendance Recorded successfully' })
  @ApiOperation({ summary: 'Attendance | Depart' })
  @ApiConflictResponse({ description: 'Unable To Record Attendance' })
  @Patch('depart/:id')
  async recordDeparture(@Param('id') id: number) {
    return this.attendanceService.recordDeparture(id);
  }
}
