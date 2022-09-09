import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';

const typeDefs = `

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

interface CreateUserInput {
  userData: UserInput;
}

interface UserInput {
  name: string;
  email: string;
  password: string;
  birthDate: string;
}

interface UserOutput {
  name: string;
  email: string;
  id: number;
  birthDate: string;
}

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
  Mutation: {
    createUser(_: unknown, args: CreateUserInput): UserOutput {
      return {
        id: 1,
        name: args.userData.name,
        email: args.userData.email,
        birthDate: args.userData.birthDate,
      };
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 3000;
server.listen({ port }).then(({ url }) => {
  console.log(`Your server is present at ${url}`);
});
