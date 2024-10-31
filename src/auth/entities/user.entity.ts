import { Entity, Column, ManyToOne, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from './role.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { AbstractEntity } from "../../_grobal_config/entities/abstract.entity";
import { Attendance } from 'src/attendance/entities/attendance.entity';
import { Verify } from './verify.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true })
  @IsEmail()
  @ApiProperty({ description: 'Unique email address of the user'})
  email: string;

  @Column()
  @Exclude()
  @ApiProperty({ description: 'Password for the user account'})
  password: string;

  @ManyToOne(() => Role, { eager: true })
  @JoinColumn({ name: 'roleId' })
  @ApiProperty({ description: 'Role assigned to the user', type: () => Role })
  role: Role;

  @Column()
  @ApiProperty({ description: 'Foreign key for the role'})
  roleId: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToOne(() => Employee, (employee) => employee.user)
  employee: Employee;

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendances: Attendance[];

  @OneToOne(() => Verify, (verify) => verify.user)
  verifications: Verify;
}
