import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { typeDefs, resolvers } from './schema';
import { AppDataSource, dataSourceSetup } from './src/data-source';

export async function startDB() {
  console.log('Initializing database...');
  dataSourceSetup();
  await AppDataSource.initialize();
  console.log('Database initialized!');
}

export async function startServer() {
  await startDB();

  console.log('Starting server...');
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = 3000;
  await server.listen({ port });
  console.log(`Your server is present at http://localhost:3000/`);
}
