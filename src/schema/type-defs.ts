import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
  }

  input UserInput {
    name: String!
    email: String!
    password: String!
    birthDate: String!
  }

  type UserOutput {
    id: Int!
    name: String!
    email: String!
    birthDate: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type LoginOutput {
    user: UserOutput!
    token: String!
  }

  type Mutation {
    createUser(userData: UserInput): UserOutput!
    login(loginData: LoginInput, rememberMe: Boolean): LoginOutput!
  }
`;
