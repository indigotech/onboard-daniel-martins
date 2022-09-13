import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';

export let AppDataSource: DataSource;

export function dataSourceSetup() {
  AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
  });
}
