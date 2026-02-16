import type { Express } from 'express';
import type { Response } from 'supertest';

import { validUser } from '../fixtures/users.js';
import { createUser } from './auth-helpers.js';

/**
 * Extracts the 'set-cookie' header from the response and returns it as an array of strings.
 */
export function getAuthCookie(res: Response): string[] {
  const setCookie = res.headers['set-cookie'];
  expect(setCookie).toBeDefined();
  return Array.isArray(setCookie) ? setCookie : [setCookie as string];
}

/**
 * Creates a new user using the provided credentials and returns the response along with the authentication cookie.
 */
export async function createAuthenticatedUser(app: Express, credentials = validUser) {
  const userRes = await createUser(app, credentials);
  const cookie = getAuthCookie(userRes);
  return { userRes, cookie };
}
