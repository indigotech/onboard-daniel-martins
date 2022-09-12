import 'mocha';
import { startServer } from '../server';

describe('Array', function () {
  before('starting server', async function () {
    await startServer();
  });
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      console.log('Hello there! Testing...');
    });
  });
});
