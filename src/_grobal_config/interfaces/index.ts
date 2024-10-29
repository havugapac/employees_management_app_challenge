export interface IAppConfig {
  port?: number;
  jwt?: JwtConfig;
  swaggerEnabled?: boolean;
  mail?: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
}

interface JwtConfig {
  secret: string;
}
