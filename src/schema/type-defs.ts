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

  type Mutation {
    createUser(userData: UserInput): UserOutput!
  }
`;
