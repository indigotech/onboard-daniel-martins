import { CreateUserInput, LoginOutput, LoginUserInput, UserInput, UserOutput } from './interfaces';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { createHmac } from 'crypto';
import { CustomError } from '../format-error';

async function validateInput(userData: UserInput) {
  const userRepo = AppDataSource.getRepository(User);
  const validatePW = new RegExp('^(?=.*[A-Za-z])(?=.*\\d).{6,}$');
  if (validatePW.test(userData.password) == false) {
    throw new CustomError(
      'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
      400,
    );
  }

  const emailCount = await userRepo.findAndCountBy({ email: userData.email });
  if (emailCount[1] >= 1) {
    throw new CustomError(
      'Email address already in use, please use another one or log in to your account.',
      400,
      'Inputted email address is already bound to an existing user in data source.',
    );
  }
}

export const resolvers = {
  Query: {
    hello: () => `Hello, Taqtiler!`,
  },
  Mutation: {
    async createUser(_: unknown, args: CreateUserInput): Promise<UserOutput> {
      const userRepo = AppDataSource.getRepository(User);
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
    async login(_: unknown, args: LoginUserInput): Promise<LoginOutput> {
      const userRepo = AppDataSource.getRepository(User);

      const hash = createHmac('sha256', 'internalizing server behavior');
      const hashedPassword = hash.update(args.loginData.password).digest('hex');

      const user = await userRepo.findOneBy({
        email: args.loginData.email,
        password: hashedPassword,
      });

      return {
        user: user,
        token: 'the_token',
      };
    },
  },
};
