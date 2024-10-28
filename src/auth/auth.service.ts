import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { IAppConfig } from 'src/_grobal_config/interfaces';
import * as bcrypt from 'bcryptjs';
import {
  AuthenticateDto,
  CreateUserDto,
  ForgotPasswordDto,
  LoginUserDto,
  VerifyUserDto,
} from './dto';
//   import { JwtPayload } from './interfaces';
import { Role as ERole } from './enum/role.enum';
import { Role } from './entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<IAppConfig>,
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  public generateToken(
    user: User,
  ): { data: { user: User; token: string } } | string {
    const { id, role, email } = user;
    const token = this.jwtService.sign(
      { id, role, email },
      { secret: this.config.get('jwt').secret },
    );

    delete user.password
    return {
      data: {
        user,
        token,
      },
    };
  }

  async createUser(dto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password,8);

    const role = await this.roleRepository.findOne({
      where: { name: ERole.EMPLOYEE },
    });

     let transaction =  await this.dataSource.transaction(async (tx) => {
      const userCreated = tx.getRepository(User).create({
        email: dto.email,
        password: hashedPassword,
        roleId: role.id,
      });
      await this.userRepository.save(userCreated);
     const employee=  tx.getRepository(Employee).create({
        user: userCreated.id,
        first_name: dto.first_name,
        last_name: dto.last_name,
        phone_number: dto.phone_number,
        employee_identifier: dto.employee_identifier,
      });
      await this.employeeRepository.save(employee);

      return userCreated
    });


   return this.generateToken(transaction)
    
  }

  async loginUser(dto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');
    if (!(await bcrypt.compare(dto.password,user.password))) {
      throw new ForbiddenException('Incorrect password');
    }

    return this.generateToken(user);
  }

  async ForgotPassword(dto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (!user) throw new NotFoundException('User not found');
    return user.id
  }

  // async verifyUserOnReset(dto: VerifyUserDto) {
  //   try {
  //     const payload: JwtPayload = this.jwtService.verify(dto.token, {
  //       secret: this.config.get('jwt').secret,
  //     });
  //     const user = await this.userRepository.findOne({
  //       where: { email: payload.email },
  //     });
  //     if (!user) throw new NotFoundException('User not found');
  //     return this.generateToken(user);
  //   } catch (error) {
  //     throw new BadRequestException('Invalid or expired token');
  //   }
  // }

  // async authenticateUser(dto: AuthenticateDto) {
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       clientId: dto.clientId,
  //       clientSecret: dto.clientSecret,
  //     },
  //   });
  //   if (!user) {
  //     return null;
  //   }
  //   return { userId: user.id };
  // }
}