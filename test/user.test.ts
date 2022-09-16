import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import { hasher, endpoint, defaultUser, createToken } from './index';

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
    dbUser.password = hasher(defaultUser.password);
    await userRepo.save(dbUser);
  });

  it('should refuse unexisting ids', async () => {
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
});
