import { CreateUserInput, JWTPayload, LoginOutput, LoginUserInput, UserInput, UserOutput } from './interfaces';
import { User } from '../entity/User';
import { AppDataSource } from '../data-source';
import { createHmac } from 'crypto';
import { CustomError } from '../format-error';
import * as jwt from 'jsonwebtoken';

export const tokenSecret = 'Understanding how to fly into w@ll5';

export function hashString(str: string) {
  const hash = createHmac('sha256', 'internalizing server behavior');
  return hash.update(str).digest('hex');
}

async function validateInput(userData: UserInput) {
  const userRepo = AppDataSource.getRepository(User);
  const passwordValidationRegex = new RegExp('^(?=.*[A-Za-z])(?=.*\\d).{6,}$');
  if (passwordValidationRegex.test(userData.password) == false) {
    throw new CustomError(
      'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
      400,
    );
  }

  const emailValidationRegex = new RegExp(
    '^\\w+([_\\.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([_\\.-]?[a-zA-Z0-9]+)*(\\.\\w{2,3})+$',
  );
  if (emailValidationRegex.test(userData.email) == false) {
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
      409,
      'Inputted email address is already bound to an existing user in data source.',
    );
  }
}

export function createToken(userID: number, rememberMe = false) {
  return jwt.sign({ userID: userID }, tokenSecret, rememberMe ? { expiresIn: '7d' } : undefined);
}

export function authenticateToken(token: string) {
  try {
    const tokenPayload = jwt.verify(token, tokenSecret) as JWTPayload;
    if (!tokenPayload.userID || !tokenPayload.iat) {
      throw new Error('jwt token missing expected fields');
    }
    if (tokenPayload.userID <= 0) {
      throw new Error('jwt token has invalid user id');
    }
  } catch (err) {
    throw new CustomError('Login error, please try to sign in again.', 401, err.message);
  }
}

export const resolvers = {
  Query: {
    hello: () => `Hello, Taqtiler!`,
    async user(_: unknown, args: { userID: number }, context: { token: string }) {
      authenticateToken(context.token);

      const userRepo = AppDataSource.getRepository(User);
      const foundUser = await userRepo.findOneBy({ id: args.userID });

      if (!foundUser) {
        throw new CustomError(
          'User not found, please try again.',
          401,
          'Searched ID did not correspond to any existing users in database.',
        );
      }

      return foundUser;
    },
  },
  Mutation: {
    async createUser(_: unknown, args: CreateUserInput, context: { token: string }): Promise<UserOutput> {
      authenticateToken(context.token);

      const userRepo = AppDataSource.getRepository(User);
      const user = new User();
      user.name = args.userData.name;
      user.email = args.userData.email;

      user.password = hashString(args.userData.password);
      user.birthDate = args.userData.birthDate;

      await validateInput(args.userData);
      await userRepo.save(user);
      return user;
    },

    async login(_: unknown, args: LoginUserInput): Promise<LoginOutput> {
      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOneBy({
        email: args.loginData.email,
        password: hashString(args.loginData.password),
      });

      if (user == null) {
        throw new CustomError(
          'User not found, please try again.',
          401,
          'Email and password did not correspond to any existing users in database.',
        );
      }

      const token = createToken(user.id, args.rememberMe);

      return {
        user: user,
        token: token,
      };
    },
  },
};
