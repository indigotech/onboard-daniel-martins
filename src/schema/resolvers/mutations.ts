import { authenticateToken, hashString, validateInput, createToken } from '.';
import { AppDataSource } from '../../data-source';
import { User } from '../../entity/User';
import { CustomError } from '../../format-error';
import { CreateUserInput, UserOutput, LoginUserInput, LoginOutput } from '../interfaces';

export const mutationResolvers = {
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
};
