import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee-dto.dto';
import { ApiCreatedResponse, ApiOperation, ApiConflictResponse, ApiBody, ApiOkResponse, ApiTags, ApiBearerAuth, ApiInternalServerErrorResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { PasswordResetDto } from './dto/password-reset-dto.dto';
import { AllowRoles } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Role as ERoles } from '../auth/enum/role.enum'

@ApiTags('Employees')
@UseGuards(JwtGuard, RolesGuard)
@AllowRoles(ERoles.EMPLOYEE)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @ApiOkResponse({ description: 'Employee Updated successfully' })
  @ApiOperation({ summary: 'Update Employee' })
  @ApiConflictResponse({ description: 'Unable To Update' })
  @ApiBody({ type: UpdateEmployeeDto })
  @Patch(':id')
  async updateEmployee(
    @Param('id') id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeesService.updateEmployee(id, updateEmployeeDto);
  }

  @ApiBody({ type: PasswordResetDto })
  @ApiCreatedResponse({ description: 'Password successfully reset' })
  @ApiOperation({ summary: 'User Password Reset' })
  @ApiBody({ type: PasswordResetDto})
  @Patch(':id')
  async resetPassword(
  @Param('id') id: number,
  @Body() passwordResetDto: PasswordResetDto, ) {
    return await this.employeesService.passwordReset(id, passwordResetDto);
  }
}
