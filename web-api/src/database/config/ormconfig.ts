import {
  DB_NAME,
  DB_PASSWORD,
  DB_USERNAME,
  PG_HOST,
  PG_PORT,
} from '@config/env';
import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const config: DataSourceOptions = {
  type: 'postgres',
  name: 'default',
  host: PG_HOST,
  port: Number(PG_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: false,
  logging: false,
  entities: ['src/database/entities/**/*.ts'],
  migrations: ['src/database/migrations/**/*.ts'],
  subscribers: ['src/database/subscriber/**/*.ts'],
  namingStrategy: new SnakeNamingStrategy(),
};

export default config;
