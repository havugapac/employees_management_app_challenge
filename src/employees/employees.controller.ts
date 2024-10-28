import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { UpdateEmployeeDto } from './dto/update-employee-dto.dto';
import { ApiCreatedResponse, ApiOperation, ApiConflictResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // @Post()
  // create(@Body() createEmployeeDto: CreateEmployeeDto) {
  //   return this.employeesService.create(createEmployeeDto);
  // }

  // @Get()
  // findAll() {
  //   return this.employeesService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.employeesService.findOne(+id);
  // }

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

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.employeesService.remove(+id);
  // }
}
