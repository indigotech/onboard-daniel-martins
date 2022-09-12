import 'mocha';
import { startServer } from '../server';
import axios from 'axios';

describe('Array', function () {
  before('starting server', function (done) {
    startServer().then(done);
  });
  it('should get a hello back from the server', async function () {
    const endpoint = 'http://localhost:3000/';
    const headers = {
      'content-type': 'application/json',
      Authorization: '<token>',
    };
    const sayHelloQuery = {
      operationName: 'helloQuery',
      query: `query helloQuery { hello }`,
      variables: {},
    };
    const response = await axios({
      url: endpoint,
      method: 'post',
      headers: headers,
      data: sayHelloQuery,
    });
    console.log(response.data);
  });
});
