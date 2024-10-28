import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from "../../_grobal_config/entities/abstract.entity";

@Entity('employees')
export class Employee extends AbstractEntity {
  @OneToOne(() => User, (user) => user.id)
  @JoinColumn()
  user: number;

  @Column()
  @ApiProperty({ description: 'Employee First name' })
  first_name: string;

  @Column()
  @ApiProperty({ description: 'Employee Last name' })
  last_name: string;

  @Column()
  @ApiProperty({ description: 'Employee phone' })
  phone_number: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Employee Identifier' })
  employee_identifier: string;
}
