import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee-dto.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  findAll() {
    return `This action returns all employees`;
  }

  findOne(id: number) {
    return `This action returns a #${id} employee`;
  }

  async updateEmployee(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { user: id } });
  
    if (!employee) {
      throw new NotFoundException(`Employee with id ${id} not found`);
    }
  
    const updatedEmployee = this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(updatedEmployee);
  }
  

  remove(id: number) {
    return `This action removes a #${id} employee`;
  }
}
