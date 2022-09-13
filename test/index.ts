import axios from 'axios';
import { expect } from 'chai';
import * as dotenv from 'dotenv';
import { startServer } from '../server';

const endpoint = 'http://localhost:3000/';

describe('Array', function () {
  before('starting server', async function () {
    dotenv.config({ path: './test.env' });
    await startServer();
  });

  it('should get a hello back from the server', async function () {
    const sayHelloQuery = {
      operationName: 'helloQuery',
      query: `query helloQuery { hello }`,
      variables: {},
    };

    const response = await axios({
      url: endpoint,
      method: 'post',
      data: sayHelloQuery,
    });

    expect(response.data.data.hello).to.be.eq('Hello, Taqtiler!');
  });
});
