import type { Response } from 'supertest';

/**
 * Extracts the 'set-cookie' header from the response and returns it as an array of strings.
 */
export function getAuthCookie(res: Response): string[] {
  const setCookie = res.headers['set-cookie'];
  expect(setCookie).toBeDefined();
  return Array.isArray(setCookie) ? setCookie : [setCookie as string];
}
