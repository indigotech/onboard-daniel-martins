import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { typeDefs, resolvers } from './schema';
import { AppDataSource } from './src/data-source';

AppDataSource.initialize()
  .then(async () => console.log('Database connection estabilished'))
  .catch((error) => console.log(error));

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const port = 3000;
server.listen({ port }).then(({ url }) => {
  console.log(`Your server is present at ${url}`);
});
