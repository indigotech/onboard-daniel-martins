import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { LoginInput } from '../src/schema/interfaces';
import { hasher, endpoint, defaultUser } from './index';

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

let loginInput: LoginInput;

describe('login mutation tests', async () => {
  before(async () => {
    const userRepo = AppDataSource.getRepository(User);
    const dbUser = { ...loginUser };
    dbUser.password = hasher(loginUser.password);
    await userRepo.save(dbUser);
  });

  beforeEach(() => {
    loginInput = {
      email: loginUser.email,
      password: loginUser.password,
    };
  });

  afterEach(async () => {
    await clearDB();
  });

  it('should return logged user data with token back from the server', async () => {
    const validQuery = {
      operationName: 'loginQuery',
      query: loginQuery,
      variables: { loginInput: loginInput },
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: validQuery,
    });

    const expectedResponse = {
      data: {
        login: {
          user: {
            name: loginUser.name,
            email: loginUser.email,
            birthDate: loginUser.birthDate,
            id: 1,
          },
          token: 'the_token',
        },
      },
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse bad credentials', async () => {
    loginInput.email = 'doesnotexist@gmail.com';
    const badQuery = {
      operationName: 'loginQuery',
      query: loginQuery,
      variables: { loginInput: loginInput },
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: badQuery,
    });

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
