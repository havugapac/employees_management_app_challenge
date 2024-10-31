import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/auth.controller';
import { AuthService } from '../src/auth/auth.service';
import { CreateUserDto, ForgotPasswordDto, LoginUserDto, VerifyUserDto } from '../src/auth/dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    createUser: jest.fn(),
    loginUser: jest.fn(),
    EmailForgotPassword: jest.fn(),
    verifyUserOnReset: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('userSignUp', () => {
    it('should return the result of createUser', async () => {
      const dto: CreateUserDto = {
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          phone_number: '',
          employee_identifier: ''
      };
      const result = { /* expected result */ };
      mockAuthService.createUser.mockResolvedValue(result);

      expect(await authController.userSignUp(dto)).toBe(result);
      expect(mockAuthService.createUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('userLogin', () => {
    it('should return the result of loginUser', async () => {
      const dto: LoginUserDto = {
          email: '',
          password: ''
      };
      const result = { /* expected result */ };
      mockAuthService.loginUser.mockResolvedValue(result);

      expect(await authController.userLogin(dto)).toBe(result);
      expect(mockAuthService.loginUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('verifyUserForResetingPassword', () => {
    it('should return the result of EmailForgotPassword', async () => {
      const dto: ForgotPasswordDto = {
          email: ''
      };
      const result = { /* expected result */ };
      mockAuthService.EmailForgotPassword.mockResolvedValue(result);

      expect(await authController.verifyUserForResetingPassword(dto)).toBe(result);
      expect(mockAuthService.EmailForgotPassword).toHaveBeenCalledWith(dto);
    });
  });

  describe('verifyUserOnReset', () => {
    it('should return the result of verifyUserOnReset', async () => {
      const dto: VerifyUserDto = {
          token: ''
      };
      const result = { /* expected result */ };
      mockAuthService.verifyUserOnReset.mockResolvedValue(result);

      expect(await authController.verifyUserOnReset(dto)).toBe(result);
      expect(mockAuthService.verifyUserOnReset).toHaveBeenCalledWith(dto);
    });
  });
});
