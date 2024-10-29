import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator'

export class PasswordResetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
      type: String,
      required: true,
    })
    password: string;
  }