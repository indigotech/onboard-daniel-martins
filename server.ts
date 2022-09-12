import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { typeDefs, resolvers } from './schema';
import { AppDataSource } from './src/data-source';

export async function startServer(isMain = false) {
  await AppDataSource.initialize().catch((error) => console.log(error));

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const port = 3000;
  if (isMain) {
    server.listen({ port }).then(({ url }) => {
      console.log(`Your server is present at ${url}`);
    });
  }
}

if (require.main === module) {
  const isMain = true;
  startServer(isMain);
}
