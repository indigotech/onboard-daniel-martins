import axios from 'axios';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import { startServer } from '../server';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';

export const endpoint = 'http://localhost:3000/';
function defaultInput() {
  return {
    name: 'Bob Semple',
    email: 'bobsemple@gmail.com',
    password: 'pass1234',
    birthDate: '01-01-1990',
  };
}

before(async () => {
  dotenv.config({ path: './test.env' });
  await startServer();
});

after(async () => {
  await AppDataSource.destroy();
});

afterEach(async () => {
  await clearDB();
});

it('should return user data back from the server', async () => {
  const userRepo = AppDataSource.getRepository(User);
  const userInput = defaultInput();

  const validQuery = {
    operationName: 'validQuery',
    query: `mutation validQuery ($userInput: UserInput!) { createUser(userData: $userInput) {
            name,
            email,
            birthDate
            id
          }
        }`,
    variables: {
      userInput: userInput,
    },
  };

  const response = await axios({
    url: endpoint,
    method: 'post',
    data: validQuery,
  });

  const expectedResponse = {
    data: {
      createUser: {
        name: 'Bob Semple',
        email: 'bobsemple@gmail.com',
        birthDate: '01-01-1990',
        id: 1,
      },
    },
  };

  const expectedEntry = {
    id: 1,
    name: 'Bob Semple',
    email: 'bobsemple@gmail.com',
    password: '67e0ff225304e04db922ef3a55a205afe7cebb48ad239e7d86a09f1b364f3a92',
    birthDate: '01-01-1990',
  };

  expect(response.data).to.be.deep.eq(expectedResponse);
  expect(await userRepo.findOneBy({ id: 1 })).to.be.deep.eq(expectedEntry);
});

it('should refuse short passwords', async () => {
  const userInput = defaultInput();
  userInput.password = 'a1';

  const shortPassword = {
    operationName: 'shortPassword',
    query: `mutation shortPassword ($userInput: UserInput!) { createUser(userData: $userInput) {
            name,
            email,
            birthDate
            id
          }
        }`,
    variables: {
      userInput: userInput,
    },
  };

  const response = await axios({
    url: endpoint,
    method: 'post',
    data: shortPassword,
  });

  const expectedResponse =
    'Password must be at least 6 characters long. Password must have at least one letter and one digit.';

  expect(response.data.errors[0].message).to.be.deep.eq(expectedResponse);
});

it('should refuse passwords without numbers', async () => {
  const userInput = defaultInput();
  userInput.password = 'abcdef';

  const letterPassword = {
    operationName: 'letterPassword',
    query: `mutation letterPassword ($userInput: UserInput!) { createUser(userData: $userInput) {
            name
          }
        }`,
    variables: {
      userInput: userInput,
    },
  };

  const response = await axios({
    url: endpoint,
    method: 'post',
    data: letterPassword,
  });

  const expectedResponse =
    'Password must be at least 6 characters long. Password must have at least one letter and one digit.';

  expect(response.data.errors[0].message).to.be.deep.eq(expectedResponse);
});

it('should refuse passwords without letters', async () => {
  const userInput = defaultInput();
  userInput.password = '123456';

  const numberPassword = {
    operationName: 'numberPassword',
    query: `mutation numberPassword ($userInput: UserInput!) { createUser(userData: $userInput) {
            name
          }
        }`,
    variables: {
      userInput: userInput,
    },
  };

  const response = await axios({
    url: endpoint,
    method: 'post',
    data: numberPassword,
  });

  const expectedResponse =
    'Password must be at least 6 characters long. Password must have at least one letter and one digit.';

  expect(response.data.errors[0].message).to.be.deep.eq(expectedResponse);
});

it('should refuse emails already in database', async () => {
  const userInput = defaultInput();

  const emailUser = {
    operationName: 'emailUser',
    query: `mutation emailUser ($userInput: UserInput!) { createUser(userData: $userInput) {
            name
          }
        }`,
    variables: {
      userInput: userInput,
    },
  };

  await axios({
    url: endpoint,
    method: 'post',
    data: emailUser,
  });

  const response = await axios({
    url: endpoint,
    method: 'post',
    data: emailUser,
  });

  const expectedResponse = 'Email address already in use.';

  expect(response.data.errors[0].message).to.be.deep.eq(expectedResponse);
});
