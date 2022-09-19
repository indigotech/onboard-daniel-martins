import { faker } from '@faker-js/faker';
import { AppDataSource } from './data-source';
import { startDB } from './server';
import * as dotenv from 'dotenv';
import { hashString } from './schema/resolvers';
import { User, Address } from './entity';

function createAddress() {
  const address = new Address();
  address.cep = faker.address.zipCode();
  address.street = faker.address.street();
  address.streetNumber = faker.address.buildingNumber();
  address.complement = faker.address.secondaryAddress();
  address.neighborhood = faker.address.county();
  address.city = faker.address.city();
  address.state = faker.address.state();
  return address;
}

export async function seedUsers(total = 50) {
  const userRepo = AppDataSource.getRepository(User);

  for (let i = 0; i < total; i++) {
    const user = new User();
    user.name = faker.name.firstName() + ' ' + faker.name.lastName();
    user.email = faker.internet.email(user.name.split(' ')[0], user.name.split(' ')[1]);
    user.password = hashString(user.name.split(' ')[0] + i.toString().repeat(4));
    user.birthDate = faker.date.birthdate().toDateString();

    const address1 = createAddress();
    const address2 = createAddress();
    user.addresses = [address1, address2];

    await userRepo.save(user);
  }
}

export async function seedScript() {
  dotenv.config();
  await startDB();
  await seedUsers();
}
