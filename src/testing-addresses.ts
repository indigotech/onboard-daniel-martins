import { AppDataSource } from './data-source';
import { Address, User } from './entity';
import { startServer } from './server';

export async function testingAddresses() {
  await startServer();
  const userRepo = AppDataSource.getRepository(User);

  const user = new User();
  user.name = 'Bob Semple';
  user.email = 'bob@gmail.com';
  user.password = 'abc123';
  user.birthDate = 'Yesterday';

  const address1 = new Address();
  address1.cep = '11';
  address1.city = 'fortaleza';
  address1.state = 'ceara';
  address1.complement = 'someplace';
  address1.street = 'somestreet';
  address1.streetNumber = '222';
  address1.neighborhood = 'somewhere';

  const address2 = new Address();
  address2.cep = '33';
  address2.city = 'sao paulo';
  address2.state = 'sao paulo';
  address2.complement = 'apto 111';
  address2.street = 'baker street';
  address2.streetNumber = '221';
  address2.neighborhood = 'zona sul';

  user.addresses = [address1, address2];
  await userRepo.save(user);
}
