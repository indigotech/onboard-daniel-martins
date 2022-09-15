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
const loginUser = defaultUser;

let loginInput: LoginInput;

describe('login mutation tests', async () => {
  before(async () => {
    const hashedPW = hasher(loginUser.password)
    await AppDataSource.query(
      `INSERT INTO "user"(name, email, password, "birthDate") 
      VALUES ('${loginUser.name}', '${loginUser.email}', '${hashedPW}', '${loginUser.birthDate}')`,
    );
  });

  beforeEach(async () => {
    loginInput = {
      email: loginUser.email,
      password: loginUser.password,
    };
  });

  afterEach(async () => {
    await clearDB();
  });

  it('should return user data back from the server', async () => {
    const userRepo = AppDataSource.getRepository(User);
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
    const expectedEntry = {
        id: 1,
        name: loginUser.name,
        email: loginUser.email,
        password: hasher(loginUser.password),
        birthDate: loginUser.birthDate,
      };
    expect(response.data).to.be.deep.eq(expectedResponse);
    expect(await userRepo.findOneBy({ id: 1 })).to.be.deep.eq(expectedEntry);
  });

  it('should refuse bad credentials', async () => {
    loginInput.email = 'wrongemail@gmail.com';
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
          code: 404,
          additionalInfo: 'Email and password did not correspond to any existing users in database.',
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse requests with missing email', async () => {
    loginInput.email = '';
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
          message: 'Please type both your email and your password for login.',
          code: 400,
          additionalInfo: 'Either the email or the password fields were empty on server request.',
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
  it('should refuse requests with missing password', async () => {
    loginInput.password = '';
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
          message: 'Please type both your email and your password for login.',
          code: 400,
          additionalInfo: 'Either the email or the password fields were empty on server request.',
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
});
