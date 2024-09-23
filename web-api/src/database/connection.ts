import { DataSource } from 'typeorm';
import config from './config/ormconfig';

export const AppDataSource = new DataSource(config);
