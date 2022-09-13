import * as dotenv from 'dotenv';
import { startServer, startDB } from './server';

dotenv.config();
startDB();
startServer();
