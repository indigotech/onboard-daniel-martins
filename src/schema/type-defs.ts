import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    hello: String!
    user(userID: Int!): UserOutput
    users(userMax: Int, page: Int): UserList
  }

  type Address {
    cep: String!
    street: String!
    streetNumber: String!
    complement: String
    neighborhood: String!
    city: String!
    state: String!
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
    addresses: [Address]
  }

  type UserList {
    users: [UserOutput]!
    total: Int!
    usersBefore: Boolean!
    usersAfter: Boolean!
    maxPage: Int!
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
