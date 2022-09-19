import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { startDB } from './server';
import * as dotenv from 'dotenv';
import { hashString } from './schema/resolvers';

export async function seedUsers(userNum = 50) {
  const userRepo = AppDataSource.getRepository(User);

  for (let i = 0; i < userNum; i++) {
    const user = new User();
    user.name = faker.name.firstName() + ' ' + faker.name.lastName();
    user.email = faker.internet.email(user.name.split(' ')[0], user.name.split(' ')[1]);
    user.password = hashString(user.name.split(' ')[0] + i.toString().repeat(4));
    user.birthDate = faker.date.birthdate().toDateString();
    await userRepo.save(user);
  }
}

export async function seedScript() {
  dotenv.config();
  await startDB();
  await seedUsers();
}
