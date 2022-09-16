import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { UserInput } from '../src/schema/interfaces';
import { endpoint, defaultUser, createToken } from './index';
import { hashString } from '../src/schema/resolvers';

let userInput: UserInput;

const createUserQuery = `
  mutation createUserQuery($userInput: UserInput!) {
    createUser(userData: $userInput) {
    name
    email
    birthDate
    id
  }
  }
`;
const validToken = createToken(1);
const operation = {
  operationName: 'createUserQuery',
  query: createUserQuery,
  variables: {
    userInput: userInput,
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

describe('createUser mutation tests', async () => {
  beforeEach(async () => {
    userInput = { ...defaultUser };
    operation.variables.userInput = userInput;
  });

  afterEach(async () => {
    await clearDB();
  });

  it('should return created user data back from the server', async () => {
    const userRepo = AppDataSource.getRepository(User);

    const response = await axios(request);

    const expectedResponse = {
      data: {
        createUser: {
          name: userInput.name,
          email: userInput.email,
          birthDate: userInput.birthDate,
          id: 1,
        },
      },
    };
    const expectedEntry = {
      id: 1,
      name: userInput.name,
      email: userInput.email,
      password: hashString(userInput.password),
      birthDate: userInput.birthDate,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
    expect(await userRepo.findOneBy({ id: 1 })).to.be.deep.eq(expectedEntry);
  });

  it('should refuse short passwords', async () => {
    userInput.password = 'a1';

    const response = await axios(request);

    const expectedResponse = {
      errors: [
        {
          message: 'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
          code: 400,
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse passwords without numbers', async () => {
    userInput.password = 'abcdef';

    const response = await axios(request);

    const expectedResponse = {
      errors: [
        {
          message: 'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
          code: 400,
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse passwords without letters', async () => {
    userInput.password = '123456';

    const response = await axios(request);

    const expectedResponse = {
      errors: [
        {
          message: 'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
          code: 400,
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse emails already in database', async () => {
    await axios(request);
    const response = await axios(request);

    const expectedResponse = {
      errors: [
        {
          message: 'Email address already in use, please use another one or log in to your account.',
          code: 400,
          additionalInfo: 'Inputted email address is already bound to an existing user in data source.',
        },
      ],
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });

  it('should refuse emails that are not properly formatted', async () => {
    userInput.email = 'unacceptable.com';
    const badEmail = {
      operationName: 'createUserQuery',
      query: createUserQuery,
      variables: {
        userInput: userInput,
      },
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: badEmail,
    });

    const expectedResponse = {
      errors: [
        {
          message: 'Invalid email address, please try another one.',
          code: 400,
          additionalInfo: 'Email address received by server is not properly formatted.',
        },
      ],
      data: null,
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
      data: null,
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
      data: null,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
  });
});
