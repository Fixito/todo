import request from 'supertest';

import { createApp } from '../../src/app.js';

const app = createApp();

// biome-ignore lint/style/noProcessEnv: needed for test configuration
const prefix = process.env.API_PREFIX ?? '/api/v1';

describe('POST /auth/register', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post(`${prefix}/auth/register`)
      .send({
        email: 'test@test.com',
        password: 'password123',
      })
      .expect(201);

    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('test@test.com');
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    await request(app).post(`${prefix}/auth/register`).send({
      email: 'test@test.com',
      password: 'password123',
    });

    const res = await request(app)
      .post(`${prefix}/auth/register`)
      .send({
        email: 'test@test.com',
        password: 'password123',
      })
      .expect(409);

    expect(res.body.message).toBe('Email already in use');
  });

  it('should reject invalid payload', async () => {
    await request(app)
      .post(`${prefix}/auth/register`)
      .send({
        email: 'not-an-email',
        password: '123',
      })
      .expect(400);
  });
});
