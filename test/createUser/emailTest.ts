import axios from 'axios';
import { expect } from 'chai';
import { endpoint } from '../index';

export async function repeatEmail() {
  const firstUser = {
    operationName: 'firstUser',
    query: `mutation firstUser { createUser(userData: {
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

  const secondUser = {
    operationName: 'secondUser',
    query: `mutation secondUser { createUser(userData: {
          name: "John Nathan"
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

  await axios({
    url: endpoint,
    method: 'post',
    data: firstUser,
  });

  const secondResponse = await axios({
    url: endpoint,
    method: 'post',
    data: secondUser,
  });

  expect(secondResponse.data.data).to.be.eq(null);
  expect(secondResponse.data.errors[0].message).to.be.eq('Email address already in use.');
}
