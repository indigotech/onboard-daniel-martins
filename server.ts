import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { typeDefs, resolvers } from './schema';
import { AppDataSource, dataSourceSetup } from './src/data-source';

export async function startDB() {
  dataSourceSetup();
  await AppDataSource.initialize();
}

export async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = 3000;
  await server.listen({ port });
  console.log(`Your server is present at http://localhost:3000/`);
}
