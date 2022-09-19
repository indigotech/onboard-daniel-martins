import * as dotenv from 'dotenv';
import { startServer } from './server';
import { testingAddresses } from './testing-addresses';

dotenv.config();
testingAddresses();
