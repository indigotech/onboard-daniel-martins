import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'db-admin',
  password: 'taq1234',
  database: 'local-data',
  synchronize: true,
  logging: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
