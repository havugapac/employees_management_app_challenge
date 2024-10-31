import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateEmployeeDto } from './dto/update-employee-dto.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { PasswordResetDto } from './dto/password-reset-dto.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getEmployees() {
    return await this.employeeRepository.find({
      select: ['id', 'first_name', 'last_name'],
    });
  }

  async updateEmployee(user: User, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { user: user.id } });
  
    if (!employee) {
      throw new NotFoundException(`Employee with id ${user.id} not found`);
    }
  
    const updatedEmployee = this.employeeRepository.merge(employee, updateEmployeeDto);
    return await this.employeeRepository.save(updatedEmployee);
  }
  

  async passwordReset(id: number, dto: PasswordResetDto) {
    const password = await bcrypt.hash(dto.password, 8);
    await this.userRepository.update(id, { password });
    return 'password successfully reset';
  }
}
