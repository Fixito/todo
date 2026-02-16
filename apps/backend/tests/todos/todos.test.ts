import request from 'supertest';

import { createApp } from '@/app.js';

import { prefix } from '../helpers/auth-helpers.js';
import { createAuthenticatedUser } from '../helpers/todos-helper.js';

const app = createApp();

describe('GET /todos', () => {
  it('should require authentication', async () => {
    await request(app).get(`${prefix}/todos`).expect(401);
  });

  it('should return todos for authenticated user', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    const res = await request(app).get(`${prefix}/todos`).set('Cookie', cookie).expect(200);

    expect(res.body.todos).toBeDefined();
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos).toHaveLength(0);
  });

  it('should isolate todos between users', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    await request(app)
      .post(`${prefix}/todos`)
      .set('Cookie', cookie)
      .send({ text: 'User 1 todo' })
      .expect(201);

    const { cookie: cookie2 } = await createAuthenticatedUser(app, {
      email: 'user2@test.com',
      password: 'password',
    });

    const res = await request(app).get(`${prefix}/todos`).set('Cookie', cookie2).expect(200);

    expect(res.body.todos).toHaveLength(0);
  });
});

describe('POST /todos', () => {
  it('should require authentication', async () => {
    await request(app).post(`${prefix}/todos`).send({ text: 'Test todo' }).expect(401);
  });

  it('should create a new todo for authenticated user', async () => {
    const { userRes, cookie } = await createAuthenticatedUser(app);

    const res = await request(app)
      .post(`${prefix}/todos`)
      .set('Cookie', cookie)
      .send({ text: 'Test todo' })
      .expect(201);

    expect(res.body.todo).toBeDefined();
    expect(res.body.todo.userId).toBe(userRes.body.user.id);
    expect(res.body.todo.text).toBe('Test todo');
    expect(res.body.todo.completed).toBeFalsy();
    expect(res.body.todo.position).toBe(0);
  });

  it('should return validation error if text is missing', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    const res = await request(app)
      .post(`${prefix}/todos`)
      .set('Cookie', cookie)
      .send({ text: '' })
      .expect(400);

    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].field).toBe('text');
  });
});
