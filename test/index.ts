import * as dotenv from 'dotenv';
import { startServer } from '../src/server';
import { AppDataSource, clearDB } from '../src/data-source';

export const endpoint = 'http://localhost:3000/';
export const defaultUser = {
  name: 'Bob sample',
  email: 'bobsemple@gmail.com',
  password: 'pass1234',
  birthDate: '01-01-1990',
};

before(async () => {
  dotenv.config({ path: './test.env' });
  await startServer();
});

require('./create-user.test');
require('./login.test');
require('./user.test');

after(async () => {
  await clearDB();
  await AppDataSource.destroy();
  console.info('Database connection closed.');
});
