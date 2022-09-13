import axios from 'axios';
import { expect } from 'chai';
import { endpoint } from '../index';

export async function shortPW() {
  const shortPassword = {
    operationName: 'shortPassword',
    query: `mutation shortPassword { createUser(userData: {
          name: "Bob Semple"
          email: "bobsemple@gmail.com"
          password: "pass"
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
    data: shortPassword,
  });

  expect(response.data.data).to.be.eq(null);
  expect(response.data.errors[0].message).to.be.eq(
    'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
  );
}

export async function letterPW() {
  const letterPassword = {
    operationName: 'letterPassword',
    query: `mutation letterPassword { createUser(userData: {
          name: "Bob Semple"
          email: "bobsemple@gmail.com"
          password: "abcdef"
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
    data: letterPassword,
  });

  expect(response.data.data).to.be.eq(null);
  expect(response.data.errors[0].message).to.be.eq(
    'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
  );
}

export async function numberPW() {
  const numberPassword = {
    operationName: 'numberPassword',
    query: `mutation numberPassword { createUser(userData: {
          name: "Bob Semple"
          email: "bobsemple@gmail.com"
          password: "123456"
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
    data: numberPassword,
  });

  expect(response.data.data).to.be.eq(null);
  expect(response.data.errors[0].message).to.be.eq(
    'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
  );
}
