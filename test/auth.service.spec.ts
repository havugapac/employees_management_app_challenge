import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource, Repository } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Employee } from '../src/employees/entities/employee.entity';
import { Role } from '../src/auth/entities/role.entity';
import { Verify } from '../src/auth/entities/verify.entity';
import { EmailsService } from '../src/emails/emails.service';
import { IAppConfig } from 'src/_grobal_config/interfaces';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let employeeRepository: Repository<Employee>;
  let roleRepository: Repository<Role>;
  let verifyRepository: Repository<Verify>;
  let emailsService: EmailsService;
  let dataSource: DataSource;

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      const config = {
        jwt: { secret: 'test-secret' },
        mail: { from: 'test@example.com' },
      };
      return config[key];
    }),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockEmployeeRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockVerifyRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  const mockEmailsService = {
    sendMail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Employee),
          useValue: mockEmployeeRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
        {
          provide: getRepositoryToken(Verify),
          useValue: mockVerifyRepository,
        },
        {
          provide: EmailsService,
          useValue: mockEmailsService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    employeeRepository = module.get<Repository<Employee>>(getRepositoryToken(Employee));
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    verifyRepository = module.get<Repository<Verify>>(getRepositoryToken(Verify));
    emailsService = module.get<EmailsService>(EmailsService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    const createUserDto = {
      email: 'test@example.com',
      password: 'password123',
      first_name: 'Niyo',
      last_name: 'Bosco',
      phone_number: '1234567890',
      employee_identifier: 'EMP123',
    };
  
    it('should create a new user successfully', async () => {
      const mockRole = { id: 1, name: 'EMPLOYEE' };
      const mockUser = { 
        id: 1, 
        email: createUserDto.email, 
        roleId: mockRole.id,
        role: mockRole,
        password: 'hashedPassword' 
      };
      
      mockUserRepository.findOne.mockResolvedValue(null);
      mockRoleRepository.findOne.mockResolvedValue(mockRole);
      mockDataSource.transaction.mockImplementation(async (cb) => {
        return mockUser;
      });
      mockJwtService.sign.mockReturnValue('mock-token');
  
      const result = await service.createUser(createUserDto);
  
      if (typeof result === 'object' && 'data' in result) {
        expect(result.data).toBeDefined();
        expect(result.data.token).toBeDefined();
        expect(result.data.user).toBeDefined();
      } else {
        fail('Expected result to be an object with data property');
      }
      
      expect(mockUserRepository.findOne).toHaveBeenCalled();
      expect(mockRoleRepository.findOne).toHaveBeenCalled();
      expect(mockDataSource.transaction).toHaveBeenCalled();
    });
  
    it('should throw ConflictException if user already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 1, email: createUserDto.email });
  
      await expect(service.createUser(createUserDto)).rejects.toThrow(ConflictException);
    });
  });
  
  describe('loginUser', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };
  
    it('should successfully login user', async () => {
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash(loginDto.password, 8),
        role: { id: 1, name: 'EMPLOYEE' }
      };
  
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('mock-token');
  
      const result = await service.loginUser(loginDto);
  
      if (typeof result === 'object' && 'data' in result) {
        expect(result.data).toBeDefined();
        expect(result.data.token).toBeDefined();
        expect(result.data.user).toBeDefined();
      } else {
        fail('Expected result to be an object with data property');
      }
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.loginUser(loginDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        email: loginDto.email,
        password: await bcrypt.hash('different-password', 8),
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.loginUser(loginDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('EmailForgotPassword', () => {
    const forgotPasswordDto = {
      email: 'test@example.com',
    };
    
    it('should throw NotFoundException if user not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.EmailForgotPassword(forgotPasswordDto)).rejects.toThrow(NotFoundException);
    });
  });

});


