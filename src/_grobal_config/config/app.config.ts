import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IAppConfig } from '../interfaces';

export function appConfig(): IAppConfig {
  return {
    port: +process.env.PORT,
    swaggerEnabled: process.env.SWAGGER_ENABLED === 'true',
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  };
}

export function configureSwagger(app: INestApplication): void {
  const API_TITLE = 'Employees-Management-App';
  const API_DESCRIPTION = 'API Doc. forEmployees-Management-App API';
  const API_VERSION = '1.0';
  const SWAGGER_URL = '/swagger';
  const options = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_URL, app, document, {
    customSiteTitle: 'Employees-Management-App API',
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      apisSorter: 'alpha',
      operationsSorter: 'method',
      tagsSorter: 'alpha',
    },
  });
}


export function configure(app: INestApplication): void {
  app.setGlobalPrefix('api/v1');
  app.enableCors({ origin: '*', preflightContinue: false });
  configureSwagger(app);
  const configService = app.get(ConfigService<IAppConfig>);
  if (configService.get('swaggerEnabled')) {
    configureSwagger(app);
  }
}
