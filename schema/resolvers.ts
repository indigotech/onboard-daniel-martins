import { CreateUserInput, UserOutput } from './interfaces';
import { User } from '../src/entity/User';
import { AppDataSource } from '../src/data-source';

const userRepo = AppDataSource.getRepository(User);

export const resolvers = {
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
