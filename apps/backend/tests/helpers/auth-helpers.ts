import type { Express } from 'express';
import request from 'supertest';

// biome-ignore lint/style/noProcessEnv: needed for test configuration
export const prefix = process.env.API_PREFIX ?? '/api/v1';

interface UserCredentials {
  email: string;
  password: string;
}

/**
 * Helper function to create a user via the register endpoint
 * Returns a supertest Test object to allow chaining .expect()
 */
export function createUser(app: Express, credentials: UserCredentials) {
  return request(app).post(`${prefix}/auth/register`).send(credentials);
}

/**
 * Helper function to login a user
 * Returns a supertest Test object to allow chaining .expect()
 */
export function loginUser(app: Express, credentials: UserCredentials) {
  return request(app).post(`${prefix}/auth/login`).send(credentials);
}

/**
 * Common assertions for successful auth responses (register/login)
 */
export function expectAuthSuccess(res: request.Response, email: string) {
  expect(res.body.user).toBeDefined();
  expect(res.body.user.email).toBe(email);
  expect(res.body.user.password).toBeUndefined();
  expect(res.headers['set-cookie']).toBeDefined();
}
