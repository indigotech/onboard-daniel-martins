import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, Address } from './entity';

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
    entities: [User, Address],
    migrations: [],
    subscribers: [],
  });
}

export async function clearDB() {
  await AppDataSource.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
}
