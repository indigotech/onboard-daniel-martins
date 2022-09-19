import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { endpoint, defaultUser } from './index';
import { hashString, createToken } from '../src/schema/resolvers';

const validToken = createToken(1);
const userQuery = `
  query userQuery($userID: Int!) {
    user(userID: $userID) {
      id
      name
      email
      birthDate
    }
  }
`;
const operation = {
  operationName: 'userQuery',
  query: userQuery,
  variables: {
    userID: 1,
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

describe('user query tests', async () => {
  before(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const dbUser = { ...defaultUser };
    dbUser.password = hashString(defaultUser.password);
    await userRepo.save(dbUser);
  });

  afterEach(async () => {
    await clearDB();
  });

  it('should return searched user data', async () => {
    const response = await axios(request);

    const expectedResponse = {
      data: {
        user: {
          id: 1,
          name: 'Bob sample',
          email: 'bobsemple@gmail.com',
          birthDate: '01-01-1990',
        },
      },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse nonexistent ids', async () => {
    operation.variables.userID = 0;

    const response = await axios(request);

    const expectedResponse = {
      errors: [
        {
          message: 'User not found, please try again.',
          code: 401,
          additionalInfo: 'Searched ID did not correspond to any existing users in database.',
        },
      ],
      data: {
        user: null,
      },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse users without authentication', async () => {
    const response = await axios({
      url: endpoint,
      method: 'post',
      data: operation,
    });

    const expectedResponse = {
      errors: [
        {
          message: 'Login error, please try to sign in again.',
          code: 401,
          additionalInfo: 'jwt must be provided',
        },
      ],
      data: {
        user: null,
      },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse users with bad authentication', async () => {
    const response = await axios({
      url: endpoint,
      method: 'post',
      data: operation,
      headers: {
        Authorization: createToken(-1),
      },
    });

    const expectedResponse = {
      errors: [
        {
          message: 'Login error, please try to sign in again.',
          code: 401,
          additionalInfo: 'jwt token has invalid user id',
        },
      ],
      data: {
        user: null,
      },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
});
