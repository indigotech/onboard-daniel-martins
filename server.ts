import { ApolloServer } from 'apollo-server';
import 'reflect-metadata';
import { User } from './src/entity/User';
import { AppDataSource } from './src/data-source';

//Initializes database connection
AppDataSource.initialize()
  .then(async () => console.log('Database connection estabilished'))
  .catch((error) => console.log(error));

const userRepo = AppDataSource.getRepository(User);

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
    async createUser(_: unknown, args: CreateUserInput): Promise<UserOutput> {
      const user = new User();

      console.log('Inserting a new user into the database...');
      user.name = args.userData.name;
      user.email = args.userData.email;
      user.password = args.userData.password;
      user.birthDate = args.userData.birthDate;
      await userRepo.save(user);
      console.log(user.name, user.id, user.email, user.password, user.birthDate);
      console.log('Saved a new user with id: ' + user.id);

      //console.log('Loading users from the database...');
      //const users = await userRepo.find();
      //console.log('Loaded users: ', users);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        birthDate: user.birthDate,
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
