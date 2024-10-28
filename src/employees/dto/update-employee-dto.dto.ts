import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';
export class UpdateEmployeeDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true })
    first_name: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true })
    last_name: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true })
    phone_number: string;
  
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ type: String, required: true, description: 'Unique employee identifier' })
    employee_identifier: string;
  }