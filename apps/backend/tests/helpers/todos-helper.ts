import type { Express } from 'express';
import request, { type Response } from 'supertest';

import { validUser } from '../fixtures/users.js';
import { createUser, prefix } from './auth-helpers.js';

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

/**
 * Creates a todo and returns the full todo object.
 */
export async function createTodo(app: Express, cookie: string[], text = 'Test todo') {
  const res = await request(app)
    .post(`${prefix}/todos`)
    .set('Cookie', cookie)
    .send({ text })
    .expect(201);
  return res.body.todo;
}

/**
 * Creates a second authenticated user with different credentials.
 */
export async function createSecondUser(app: Express) {
  return createAuthenticatedUser(app, {
    email: 'user2@test.com',
    password: 'password123',
  });
}

/**
 * Asserts that the response contains a validation error.
 * Checks for the standard error format with code and details.
 */
export function expectValidationError(res: Response, expectedField?: string) {
  expect(res.body.error).toBeDefined();
  expect(res.body.error.code).toBe('VALIDATION_ERROR');
  expect(res.body.error.details).toBeDefined();

  if (expectedField) {
    expect(res.body.error.details[0].field).toBe(expectedField);
  }
}
