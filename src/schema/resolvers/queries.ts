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
    const foundUser = await userRepo.findOneBy({ id: args.userID });

    if (foundUser == null) {
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
    const userNum = await userRepo.count();
    const maxPage = Math.ceil(userNum / args.userMax);
    const page = args.page ? (args.userMax * (args.page - 1) > userNum ? maxPage : args.page) : 1;
    const userOffset = args.userMax * (page - 1);
    const userLimit = args.userMax ? args.userMax : 20;

    const foundUsers = await userRepo.find({
      order: { name: 'ASC' },
      skip: userOffset,
      take: userLimit,
    });

    if (foundUsers.length == 0) {
      throw new CustomError('No users found.', 404, 'Database is currently empty, and has no users to return.');
    }

    return {
      users: foundUsers as [User],
      userNum: userNum,
      usersAfter: userOffset + userLimit < userNum,
      usersBefore: userOffset > 0,
      maxPage: maxPage,
    };
  },
};
