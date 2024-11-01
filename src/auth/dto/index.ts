import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'havugapac@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, description: 'User password' })
  password: string;

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

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    default: 'vugapac@gmail.com',
    description: 'User email address',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({ type: String, required: true, default: 'admin@123' })
  password: string;
}

export class VerifyUserDto {
  @ApiProperty({
    type: String,
    required: true,
    default: 'edfhdfttdadf',
    description: 'Token for user verification',
  })
  @IsString()
  token: string;
}

export class ForgotPasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    default: 'vugapac@gmail.com',
    description: 'User email address for password reset',
  })
  email: string;
}
