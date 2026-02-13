import request from 'supertest';

import { createApp } from '@/app.js';

import { validUser } from '../fixtures/users.js';
import { createUser, prefix } from '../helpers/auth-helpers.js';
import { getAuthCookie } from '../helpers/todos-helper.js';

const app = createApp();

describe('GET /todos', () => {
  it('should require authentication', async () => {
    await request(app).get(`${prefix}/todos`).expect(401);
  });

  it('should return todos for authenticated user', async () => {
    const userRes = await createUser(app, validUser);

    const setCookie = getAuthCookie(userRes);

    const res = await request(app).get(`${prefix}/todos`).set('Cookie', setCookie).expect(200);

    expect(res.body.todos).toBeDefined();
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos).toHaveLength(0);
  });
});
