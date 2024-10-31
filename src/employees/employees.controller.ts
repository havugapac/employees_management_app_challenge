import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee-dto.dto';
import { ApiCreatedResponse, ApiOperation, ApiConflictResponse, ApiBody, ApiOkResponse, ApiTags, ApiBearerAuth, ApiInternalServerErrorResponse, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { PasswordResetDto } from './dto/password-reset-dto.dto';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { GetUser} from 'src/auth/decorators';
import { User } from 'src/auth/entities/user.entity';
import { GenericResponse } from 'src/_grobal_config/dto';

@ApiTags('Employees')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}


  @ApiOkResponse({ description: 'Employee retrieved successfully' })
  @ApiOperation({ summary: 'Retrieve all employees' })
  @ApiForbiddenResponse({ description: 'Access denied must be admin' })
  @Get('')
  async getEmployees() {
    const result = await this.employeesService.getEmployees();
    return new GenericResponse('employees retrieved', result);
  }

  @ApiOkResponse({ description: 'Employee Updated successfully' })
  @ApiOperation({ summary: 'Update Employee' })
  @ApiConflictResponse({ description: 'Unable To Update' })
  @ApiBody({ type: UpdateEmployeeDto })
  @Patch('update-employee')
  async updateEmployee(
    @GetUser()user:User,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeesService.updateEmployee(user, updateEmployeeDto);
  }

  @ApiBody({ type: PasswordResetDto })
  @ApiCreatedResponse({ description: 'Password successfully reset' })
  @ApiOperation({ summary: 'User Password Reset' })
  @ApiBody({ type: PasswordResetDto})
  @Patch('reset-password')
  async resetPassword(
  @GetUser()user:User,
  @Body() passwordResetDto: PasswordResetDto, ) {
    return await this.employeesService.passwordReset(user.id, passwordResetDto);
  }
}
