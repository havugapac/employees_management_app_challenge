import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthenticateDto,
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  VerifyUserDto,
} from './dto';

@Controller('auth')
@ApiTags('auth')
@ApiInternalServerErrorResponse({ description: 'Internal server error' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedResponse({ description: 'User created successfully' })
  @ApiOperation({ summary: 'User registration' })
  @ApiConflictResponse({ description: 'User already exists' })
  @ApiBody({ type: CreateUserDto })
  @Post('sign-up')
  async userSignUp(@Body() dto: CreateUserDto) {
    const result = await this.authService.createUser(dto)
    return result
    
  }

  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiForbiddenResponse({ description: 'Forbidden User' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginUserDto })
  @HttpCode(200)
  @Post('login')
  async userLogin(@Body() dto: LoginUserDto) {
    const result = await this.authService.loginUser(dto);
    return result;
  }

 

 

  // @ApiOkResponse({ description: 'Verify User' })
  // @ApiBadRequestResponse({ description: 'Invalid or expired token' })
  // @ApiNotFoundResponse({ description: 'User not found' })
  // @ApiOperation({ summary: 'User verification while resetting password' })
  // @ApiBody({ type: VerifyUserDto })
  // @HttpCode(200)
  // @Post('verify-user-email')
  // async verifyUserOnReset(@Body() dto: VerifyUserDto) {
  //   const result = await this.authService.verifyUserOnReset(dto);
  //   return result;
  // }

  
}
