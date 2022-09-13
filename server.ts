import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { typeDefs, resolvers } from './schema';
import { AppDataSource } from './src/data-source';

export async function startServer() {
  await AppDataSource.initialize().catch((error) => console.log(error));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = 3000;
  server.listen({ port });
}
