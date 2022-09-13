<<<<<<< HEAD
import axios from 'axios';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import { startServer } from '../server';
=======
import * as dotenv from 'dotenv';
dotenv.config({ path: './test.env' });
import { startServer, startDB } from '../server';
import { AppDataSource, clearDB } from '../src/data-source';
>>>>>>> fa55550 (Added createUser tests for valid inputs)

import { validTest, shortPW, letterPW, numberPW, repeatEmail } from './createUser';

export const endpoint = 'http://localhost:3000/';

/* 

*/

describe('Array', function () {
  before('starting server', async function () {
    dotenv.config({ path: './test.env' });
    await startServer();
  });

  beforeEach('starting database', async function () {
    await startDB();
  });

  it('should get user data back from the server', async function () {
    await validTest(); // Checks server response for a typical valid user input
  });

  it('should refuse invalid passwords', async function () {
    await shortPW(); // Checks server response for password shorter than 6 characters
    await letterPW(); // Checks server response for letter-only password
    await numberPW(); // Checks server response for nunmber-only password
  });

  it('should refuse emails already in database', async function () {
    await repeatEmail();
  });

  afterEach('clears database', async function () {
    await clearDB();
    await AppDataSource.destroy();
  });
});
