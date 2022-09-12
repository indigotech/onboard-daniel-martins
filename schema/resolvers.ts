import { CreateUserInput, UserInput, UserOutput } from './interfaces';
import { User } from '../src/entity/User';
import { AppDataSource } from '../src/data-source';
import { createHmac } from 'crypto';

const userRepo = AppDataSource.getRepository(User);

async function validateInput(userData: UserInput) {
  const validatePW = new RegExp('^(?=.*[A-Za-z])(?=.*\\d).{6,}$');
  if (validatePW.test(userData.password) == false) {
    throw new Error(
      'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
    );
  }

  const emailCount = await userRepo.findAndCountBy({ email: userData.email });
  if (emailCount[1] >= 1) {
    throw new Error('Email address already in use.');
  }
}

export const resolvers = {
  Query: {
    hello: () => `Hello World!`,
  },
  Mutation: {
    async createUser(_: unknown, args: CreateUserInput): Promise<UserOutput> {
      const user = new User();
      user.name = args.userData.name;
      user.email = args.userData.email;

      const hash = createHmac('sha256', 'internalizing server behavior');
      user.password = hash.update(args.userData.password).digest('hex');
      user.birthDate = args.userData.birthDate;

      await validateInput(args.userData);
      await userRepo.save(user);
      return user;
    },
  },
};
