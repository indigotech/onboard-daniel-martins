import axios from 'axios';
import { expect } from 'chai';
import { AppDataSource, clearDB } from '../src/data-source';
import { User } from '../src/entity/User';
import { endpoint, createToken } from './index';
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
    userMax: 20,
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

describe('users query tests', async () => {
  beforeEach(async () => {
    seedUsers();
  });
  afterEach(async () => {
    clearDB();
  });
});
/*
Test list:
- Successful query
- invalid userMax
- invalid page number
- asking for a page beyond possible (successful)
- Empty database
- checking beforeUser and afterUser (2 or 3 tests)
- unauthorized
*/
