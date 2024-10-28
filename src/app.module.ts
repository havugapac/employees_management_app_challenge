import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { EmployeesModule } from './employees/employees.module';
import { EmailsModule } from './emails/emails.module';
import { ReportsModule } from './reports/reports.module';
import { AttendanceModule } from './attendance/attendance.module';
import { appConfig } from './_grobal_config/config/app.config';
import { GlobalExceptionFilter } from './_grobal_config/filters/global-exception.filter';
import { RoleSeederModule} from './seeders/role-seeder.module';
import typeorm from './_grobal_config/config/typeorm';

@Module({
  imports: [
ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, typeorm],
}
   ),
   TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => (configService.get('typeorm'))
  }),
    AuthModule,
    EmployeesModule,
    EmailsModule,
    ReportsModule,
    AttendanceModule,
    RoleSeederModule
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ]
})
export class AppModule {}
