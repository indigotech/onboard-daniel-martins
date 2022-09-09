import { CreateUserInput, UserInput, UserOutput } from './interfaces';
import { User } from '../src/entity/User';
import { AppDataSource } from '../src/data-source';

const userRepo = AppDataSource.getRepository(User);

async function validateInput(userData: UserInput) {
  // A valid password should have:
  // At least 6 characters
  // At least 1 letter and 1 digit
  if (userData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
  if (userData.password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }
}

export const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
  Mutation: {
    async createUser(_: unknown, args: CreateUserInput): Promise<UserOutput> {
      const user = new User();

      console.log('Inserting a new user into the database...');
      user.name = args.userData.name;
      // The system should not allow two or more users with the same e-mail
      user.email = args.userData.email;
      user.password = args.userData.password;
      user.birthDate = args.userData.birthDate;
      await validateInput(args.userData);
      await userRepo.save(user);
      console.log(user.name, user.id, user.email, user.password, user.birthDate);
      console.log('Saved a new user with id: ' + user.id);

      //console.log('Loading users from the database...');
      //const users = await userRepo.find();
      //console.log('Loaded users: ', users);

      return user;
    },
  },
};
