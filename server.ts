import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { typeDefs, resolvers } from './schema';
import { AppDataSource, dataSourceSetup } from './src/data-source';

export async function startDB() {
  console.info('Initializing database...');
  dataSourceSetup();
  await AppDataSource.initialize();
  console.info('Database initialized!');
}

export async function startServer() {
  await startDB();

  console.info('Starting server...');
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = 3000;
  await server.listen({ port });
  console.info(`Your server is present at http://localhost:3000/`);
}
