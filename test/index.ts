import * as dotenv from 'dotenv';
import { startServer } from '../src/server';
import { AppDataSource, clearDB } from '../src/data-source';

before(async () => {
  dotenv.config({ path: './test.env' });
  await startServer();
});

require('./create-user.test');
require('./login.test');

after(async () => {
  await clearDB();
  await AppDataSource.destroy();
  console.info('Database connection closed.');
});
