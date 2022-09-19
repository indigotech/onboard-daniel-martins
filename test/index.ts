import * as dotenv from 'dotenv';
import { startServer } from '../src/server';
import { AppDataSource, clearDB } from '../src/data-source';

export const endpoint = 'http://localhost:3000/';
export const defaultUser = {
  name: 'Bob sample',
  email: 'bobsemple@gmail.com',
  password: 'pass1234',
  birthDate: '01-01-1990',
  addresses: [
    {
      cep: 'NW1 6XE',
      city: 'Westminster',
      state: 'London',
      complement: 'b 111',
      street: 'Baker Street',
      streetNumber: '221',
      neighborhood: 'Marylebone',
    },
    {
      cep: '6JFX+CCW',
      city: 'Longyearbyen',
      state: 'Svalbard & Jan Mayen',
      complement: 'The black building with orange details',
      street: 'Hilmar Rekstens vei',
      streetNumber: '9170',
      neighborhood: 'Longyearbyen',
    },
  ],
};

before(async () => {
  dotenv.config({ path: './test.env' });
  await startServer();
  await clearDB();
});

require('./create-user.test');
require('./login.test');
require('./user.test');
require('./users.test');

after(async () => {
  await clearDB();
  await AppDataSource.destroy();
  console.info('Database connection closed.');
});
