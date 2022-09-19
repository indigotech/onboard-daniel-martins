import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { endpoint } from './index';
import { createToken } from '../src/schema/resolvers';
import { seedUsers } from '../src/seed-script';

const validToken = createToken(1);
const usersQuery = `
  query usersQuery($userMax: Int, $page: Int) {
    users(userMax: $userMax, page: $page) {
      users {
        id
        name
        email
        birthDate
      }
      userNum
      usersBefore
      usersAfter
      maxPage
    }
  }
`;
const operation = {
  operationName: 'usersQuery',
  query: usersQuery,
  variables: {
    userMax: 10,
    page: 1,
  },
};
const request = {
  url: endpoint,
  method: 'post',
  data: operation,
  headers: {
    Authorization: validToken,
  },
};
const defaultResponse = {
  data: {
    users: {
      users: undefined,
      userNum: 50,
      usersBefore: false,
      usersAfter: true,
      maxPage: 5,
    },
  },
};
const invalidParamsResponse = {
  errors: [
    {
      message: 'Invalid page and/or user number, please try again',
      code: 401,
      additionalInfo: 'Either the page number or the max users per page number received were negative.',
    },
  ],
  data: { users: null },
};
let expectedResponse;

describe('users query tests', async () => {
  beforeEach(async () => {
    await seedUsers();
    expectedResponse = { ...defaultResponse };
    operation.variables.page = 1;
    operation.variables.userMax = 10;
  });

  afterEach(async () => {
    clearDB();
  });

  it('should return first 10 users when called with no page and userMax variables', async () => {
    const userRepo = AppDataSource.getRepository(User);

    const response = await axios(request);

    expectedResponse.data.users.users = await userRepo.find({
      order: { name: 'ASC' },
      take: 10,
      select: { id: true, name: true, email: true, birthDate: true },
    });
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should return specified users when called with page and userMax variables', async () => {
    const userRepo = AppDataSource.getRepository(User);
    operation.variables.page = 4;
    operation.variables.userMax = 6;

    const response = await axios(request);

    expectedResponse.data.users.users = await userRepo.find({
      order: { name: 'ASC' },
      skip: 18,
      take: 6,
      select: { id: true, name: true, email: true, birthDate: true },
    });
    expectedResponse.data.users.maxPage = 9;
    expectedResponse.data.users.usersBefore = true;
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should return last possible page when called with a page variable beyond possible maximum', async () => {
    const userRepo = AppDataSource.getRepository(User);
    operation.variables.page = 100;
    operation.variables.userMax = 5;

    const response = await axios(request);

    expectedResponse.data.users.users = await userRepo.find({
      order: { name: 'ASC' },
      skip: 45,
      take: 5,
      select: { id: true, name: true, email: true, birthDate: true },
    });
    expectedResponse.data.users.maxPage = 10;
    expectedResponse.data.users.usersBefore = true;
    expectedResponse.data.users.usersAfter = false;
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse queries with invalid userMax parameter', async () => {
    operation.variables.userMax = -1;

    const response = await axios(request);

    expectedResponse = invalidParamsResponse;
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse queries with invalid page parameter', async () => {
    operation.variables.page = -1;

    const response = await axios(request);

    expectedResponse = invalidParamsResponse;
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse queries lacking proper authorization', async () => {
    const response = await axios({
      url: endpoint,
      method: 'post',
      data: operation,
    });

    expectedResponse = {
      errors: [
        {
          message: 'Login error, please try to sign in again.',
          code: 401,
          additionalInfo: 'jwt must be provided',
        },
      ],
      data: { users: null },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should give an error with an empty database', async () => {
    await clearDB();
    const response = await axios(request);

    expectedResponse = {
      errors: [
        {
          message: 'No users found.',
          code: 404,
          additionalInfo: 'Database is currently empty, and has no users to return.',
        },
      ],
      data: { users: null },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
});
