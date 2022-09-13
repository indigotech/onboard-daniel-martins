import axios from 'axios';
import { expect } from 'chai';
import { endpoint } from '../index';

export async function validTest() {
  const validQuery = {
    operationName: 'validQuery',
    query: `mutation validQuery { createUser(userData: {
          name: "Bob Semple"
          email: "bobsemple@gmail.com"
          password: "pass1234"
          birthDate: "01-01-1990"
          }) {
            name,
            email,
            birthDate
            id
          }
        }`,
  };

  const response = await axios({
    url: endpoint,
    method: 'post',
    data: validQuery,
  });

  expect(response.data.data.createUser.name).to.be.eq('Bob Semple');
  expect(response.data.data.createUser.email).to.be.eq('bobsemple@gmail.com');
  expect(response.data.data.createUser.birthDate).to.be.eq('01-01-1990');
  expect(response.data.data.createUser.id).to.be.eq(1);
}
