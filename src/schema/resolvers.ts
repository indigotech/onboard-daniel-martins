import { CreateUserInput, LoginOutput, LoginUserInput, UserInput, UserOutput } from './interfaces';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { createHmac } from 'crypto';
import { CustomError } from '../format-error';

export function hasher(str: string) {
  const hash = createHmac('sha256', 'internalizing server behavior');
  return hash.update(str).digest('hex');
}

async function validateInput(userData: UserInput) {
  const userRepo = AppDataSource.getRepository(User);
  const validatePW = new RegExp('^(?=.*[A-Za-z])(?=.*\\d).{6,}$');
  if (validatePW.test(userData.password) == false) {
    throw new CustomError(
      'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
      400,
    );
  }

  const validateEmail = new RegExp('^\\w+([_\\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([_\\.-]?[a-zA-Z0-9]+)*(\\.\\w{2,3})+$');
  if (validateEmail.test(userData.email) == false) {
    throw new CustomError(
      'Invalid email address, please try another one.',
      400,
      'Email address received by server is not properly formatted.',
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

      user.password = hasher(args.userData.password);
      user.birthDate = args.userData.birthDate;

      await validateInput(args.userData);
      await userRepo.save(user);
      return user;
    },

    async login(_: unknown, args: LoginUserInput): Promise<LoginOutput> {
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOneBy({
        email: args.loginData.email,
        password: hasher(args.loginData.password),
      });

      if (user == null) {
        throw new CustomError(
          'User not found, please try again.',
          401,
          'Email and password did not correspond to any existing users in database.',
        );
      }

      return {
        user: user,
        token: 'the_token',
      };
    },
  },
};
