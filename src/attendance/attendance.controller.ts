import { Controller, Patch, Post, UseGuards } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { ApiOkResponse, ApiOperation, ApiConflictResponse, ApiTags, ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@Controller('attendance')
@ApiTags('Attendance')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @ApiCreatedResponse({ description: 'Attendance Recorded successfully' })
  @ApiOperation({ summary: 'Attendance | Arrival' })
  @ApiConflictResponse({ description: 'Unable To Record Attendance' })
  @Post('arrive')
  async recordArrival(@GetUser()user:User) {
    return this.attendanceService.recordArrival(user);
  }

  @ApiOkResponse({ description: 'Attendance Recorded successfully' })
  @ApiOperation({ summary: 'Attendance | Depart' })
  @ApiConflictResponse({ description: 'Unable To Record Attendance' })
  @Patch('depart')
  async recordDeparture(@GetUser() user:User) {
    return this.attendanceService.recordDeparture(user);
  }
}
