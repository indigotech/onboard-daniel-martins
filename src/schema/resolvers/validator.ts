import { UserInput } from '../interfaces';
import { User } from '../../entity/User';
import { AppDataSource } from '../../data-source';
import { CustomError } from '../../format-error';

export async function validateInput(userData: UserInput) {
  const userRepo = AppDataSource.getRepository(User);
  const passwordValidationRegex = new RegExp(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/);
  if (!passwordValidationRegex.test(userData.password)) {
    throw new CustomError(
      'Password must be at least 6 characters long. Password must have at least one letter and one digit.',
      400,
    );
  }

  const emailValidationRegex = new RegExp(/^\w+([_.-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([_.-]?[a-zA-Z0-9]+)*(\.\w{2,3})+$/);
  if (!emailValidationRegex.test(userData.email)) {
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
