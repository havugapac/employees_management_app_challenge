export interface IAppConfig {
  port?: number;
  env?: any;
  jwt?: JwtConfig;
  swaggerEnabled?: boolean;
}

interface JwtConfig {
  secret: string;
}
