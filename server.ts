import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';

const typeDefs = `
  type Query {
    hello: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => `Hello World!`,
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
