import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from 'typeorm-extension';

dotenvConfig({ path: '.env' });

const config: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: `${process.env.DB_HOST}`,
    port: parseInt(process.env.DB_PORT),
    username: `${process.env.DB_USERNAME}`,
    password: `${process.env.DB_PASSWORD}`,
    database: `${process.env.DB_NAME}`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/db/migrations/*{.ts,.js}"],
    migrationsTableName: 'employees_management_migration',
    synchronize: false,
    seeds: ['dist/bd/seeders/**/*.js'],
    factories: ['dist/db/factories/**/*.js'],
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config);