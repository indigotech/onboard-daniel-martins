import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource } from '../src/data-source';
import { User } from '../src/entity/User';
import { LoginInput } from '../src/schema/interfaces';
import { endpoint, defaultUser } from './index';
import { hashString, createToken } from '../src/schema/resolvers';

let loginInput: LoginInput;

const loginQuery = `
  mutation loginQuery($loginInput: LoginInput!) {
    login(loginData: $loginInput) {
      user {
        id
        name
        email
        birthDate
      }
      token
    }
  }
`;
const loginUser = { ...defaultUser };
const operation = {
  operationName: 'loginQuery',
  query: loginQuery,
  variables: { loginInput: loginInput },
};
const request = {
  url: endpoint,
  method: 'post',
  data: operation,
};

describe('login mutation tests', async () => {
  before(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const dbUser = { ...loginUser };
    dbUser.password = hashString(loginUser.password);
    await userRepo.save(dbUser);
  });

  beforeEach(() => {
    loginInput = {
      email: loginUser.email,
      password: loginUser.password,
    };
    operation.variables.loginInput = loginInput;
  });

  it('should return logged user data with token back from the server', async () => {
    const response = await axios(request);

    const expectedResponse = {
      data: {
        login: {
          user: {
            name: loginUser.name,
            email: loginUser.email,
            birthDate: loginUser.birthDate,
            id: 1,
          },
          token: createToken(1),
        },
      },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse bad credentials', async () => {
    loginInput.email = 'doesnotexist@gmail.com';

    const response = await axios(request);

    const expectedResponse = {
      errors: [
        {
          message: 'User not found, please try again.',
          code: 401,
          additionalInfo: 'Email and password did not correspond to any existing users in database.',
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
});
