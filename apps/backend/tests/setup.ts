import { resolve } from 'node:path';
import process from 'node:process';

import { config } from 'dotenv';

config({
  path: resolve(process.cwd(), '../../.env'),
});

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL_TEST is not defined');
}

import { prisma } from '../src/lib/prisma.js';

beforeAll(async () => {
  await prisma.$connect();
});

beforeEach(async () => {
  await prisma.$executeRawUnsafe(`
  TRUNCATE TABLE "Todo", "User" RESTART IDENTITY CASCADE;
`);
});

afterAll(async () => {
  await prisma.$disconnect();
});
