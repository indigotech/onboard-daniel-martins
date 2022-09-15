import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { UserInput } from '../src/schema/interfaces';
import { hasher, endpoint, defaultUser } from './index';

const createUserQuery = `mutation createUserQuery ($userInput: UserInput!) { createUser(userData: $userInput) {
    name,
    email,
    birthDate
    id
  }
}`

let userInput: UserInput;

describe('createUser mutation tests', async () => {
  beforeEach(() => {
    userInput = { ...defaultUser }
  })

  afterEach(async () => {
    await clearDB();
  });

  it('should return created user data back from the server', async () => {
    const userRepo = AppDataSource.getRepository(User);
    const validQuery = {
      operationName: 'createUserQuery',
      query: createUserQuery,
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
      password: hasher(userInput.password),
      birthDate: userInput.birthDate,
    };
    expect(response.data).to.be.deep.eq(expectedResponse);
    expect(await userRepo.findOneBy({ id: 1 })).to.be.deep.eq(expectedEntry);
  });

  it('should refuse short passwords', async () => {
    userInput.password = 'a1';
    const shortPassword = {
        operationName: 'createUserQuery',
        query: createUserQuery,
        variables: {
          userInput: userInput,
        },
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: shortPassword,
    });

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
    const letterPassword = {
        operationName: 'createUserQuery',
        query: createUserQuery,
        variables: {
          userInput: userInput,
        },
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: letterPassword,
    });

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
    const numberPassword = {
        operationName: 'createUserQuery',
        query: createUserQuery,
        variables: {
          userInput: userInput,
        },
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: numberPassword,
    });

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
    const repeatEmail = {
        operationName: 'createUserQuery',
        query: createUserQuery,
        variables: {
          userInput: userInput,
        },
    };

    await axios({
      url: endpoint,
      method: 'post',
      data: repeatEmail,
    });

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: repeatEmail,
    });

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
});