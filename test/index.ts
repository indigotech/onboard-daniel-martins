import 'mocha';
import { startServer } from '../server';
import axios from 'axios';
import { expect } from 'chai';

describe('Array', function () {
  before('starting server', function (done) {
    startServer().then(done);
  });
  it('should get a hello back from the server', async function () {
    const endpoint = 'http://localhost:3000/';

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
