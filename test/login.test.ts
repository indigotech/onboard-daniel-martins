import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { hash, endpoint, defaultUser } from './index';

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

let loginInput;

describe('login mutation tests', async () => {
  before(async () => {
    await AppDataSource.query(
      `INSERT INTO "user"(name, email, password, "birthDate") 
      VALUES ('Bob Semple', 'bobsemple@gmail.com', '474d57b79c3cab2a4af8bf92c788a41601efae9e17dff9ef0fe86430016857cf', 'Yesterday')`,
    );
  });

  beforeEach(async () => {
    loginInput = {
      email: 'bobsemple@gmail.com',
      password: 'abc123',
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
            name: 'Bob Semple',
            email: 'bobsemple@gmail.com',
            birthDate: 'Yesterday',
            id: 1,
          },
          token: 'the_token',
        },
      },
    };
    const expectedEntry = {
        id: 1,
        name: loginInput.name,
        email: loginInput.email,
        password: hash.update(loginInput.password).digest('hex'),
        birthDate: loginInput.birthDate,
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
