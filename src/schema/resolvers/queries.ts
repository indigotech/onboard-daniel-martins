import { UserList } from '../interfaces';
import { User } from '../../entity/User';
import { AppDataSource } from '../../data-source';
import { CustomError } from '../../format-error';
import { authenticateToken } from '.';

export const queryResolvers = {
  hello: () => `Hello, Taqtiler!`,
  async user(_: unknown, args: { userID: number }, context: { token: string }) {
    authenticateToken(context.token);

    const userRepo = AppDataSource.getRepository(User);
    const foundUser = await userRepo.findOne({ where: { id: args.userID }, relations: { addresses: true } });

    if (!foundUser) {
      throw new CustomError(
        'User not found, please try again.',
        401,
        'Searched ID did not correspond to any existing users in database.',
      );
    }

    return foundUser;
  },
  async users(_: unknown, args: { userMax: number; page: number }, context: { token: string }): Promise<UserList> {
    authenticateToken(context.token);
    if (args.page < 0 || args.userMax <= 0) {
      throw new CustomError(
        'Invalid page and/or user number, please try again',
        401,
        'Either the page number or the max users per page number received were negative.',
      );
    }
    const userRepo = AppDataSource.getRepository(User);
    const total = await userRepo.count();
    const maxPage = Math.ceil(total / args.userMax);
    const page = args.page ? (args.userMax * (args.page - 1) > total ? maxPage : args.page) : 1;
    const userOffset = args.userMax * (page - 1);
    const userLimit = args.userMax ? args.userMax : 20;

    const foundUsers = await userRepo.find({
      order: { name: 'ASC' },
      skip: userOffset,
      take: userLimit,
      relations: { addresses: true },
    });

    return {
      users: foundUsers,
      total: total,
      usersAfter: userOffset + userLimit < total,
      usersBefore: userOffset > 0,
      maxPage: maxPage,
    };
  },
};
