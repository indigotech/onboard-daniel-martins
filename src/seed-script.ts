import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { startDB } from './server';
import * as dotenv from 'dotenv';

export async function seedUsers(userNum = 50) {
  await startDB();
  const userRepo = AppDataSource.getRepository(User);

  for (let i = 0; i < userNum; i++) {
    const user = new User();
    user.name = faker.name.firstName() + ' ' + faker.name.lastName();
    user.email = faker.internet.email(user.name.split(' ')[0], user.name.split(' ')[1]);
    user.password = user.name.split(' ')[0] + i.toString().repeat(4);
    user.birthDate = faker.date.birthdate().toDateString();
    await userRepo.save(user);
  }
}

if (require.main === module) {
  dotenv.config();
  seedUsers();
}
