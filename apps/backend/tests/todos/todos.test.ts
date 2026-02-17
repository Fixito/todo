import request from 'supertest';

import { createApp } from '@/app.js';

import { prefix } from '../helpers/auth-helpers.js';
import {
  createAuthenticatedUser,
  createSecondUser,
  createTodo,
  expectValidationError,
} from '../helpers/todos-helper.js';

const app = createApp();

describe('Authentication', () => {
  it('GET /todos requires authentication', async () => {
    await request(app).get(`${prefix}/todos`).expect(401);
  });

  it('POST /todos requires authentication', async () => {
    await request(app).post(`${prefix}/todos`).send({ text: 'Test todo' }).expect(401);
  });

  it('PATCH /todos/:id requires authentication', async () => {
    await request(app).patch(`${prefix}/todos/fake-id`).send({ text: 'Updated' }).expect(401);
  });

  it('DELETE /todos/:id requires authentication', async () => {
    await request(app).delete(`${prefix}/todos/fake-id`).expect(401);
  });
});

describe('GET /todos', () => {
  it('should return todos for authenticated user', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    const res = await request(app).get(`${prefix}/todos`).set('Cookie', cookie).expect(200);

    expect(res.body.todos).toBeDefined();
    expect(Array.isArray(res.body.todos)).toBe(true);
    expect(res.body.todos).toHaveLength(0);
  });

  it('should isolate todos between users', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    await createTodo(app, cookie, 'User 1 todo');

    const { cookie: cookie2 } = await createSecondUser(app);

    const res = await request(app).get(`${prefix}/todos`).set('Cookie', cookie2).expect(200);

    expect(res.body.todos).toHaveLength(0);
  });
});

describe('POST /todos', () => {
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

  it('should return validation error if text is empty', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    const res = await request(app)
      .post(`${prefix}/todos`)
      .set('Cookie', cookie)
      .send({ text: '' })
      .expect(400);

    expectValidationError(res, 'text');
  });
});

describe('PATCH /todos/:id', () => {
  it('should return validation error for invalid id', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    await request(app)
      .patch(`${prefix}/todos/invalid-id`)
      .set('Cookie', cookie)
      .send({ text: 'Updated text' })
      .expect(400);
  });

  it('should return validation error if text is empty', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({ text: '' })
      .expect(400);

    expectValidationError(res);
  });

  it('should update the todo', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({ text: 'Updated text' })
      .expect(200);

    expect(res.body.todo.text).toBe('Updated text');
  });

  it('should return 404 when updating non-existent todo', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    await request(app)
      .patch(`${prefix}/todos/clhqxq9yj0000qz0ghwvw86e7`)
      .set('Cookie', cookie)
      .send({ text: 'Updated text' })
      .expect(404);
  });

  it("should not allow updating another user's todo", async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie, 'User 1 todo');

    const { cookie: cookie2 } = await createSecondUser(app);

    await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie2)
      .send({ text: 'Updated text' })
      .expect(403);
  });

  it('should update only the position', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({ position: 5 })
      .expect(200);

    expect(res.body.todo.position).toBe(5);
    expect(res.body.todo.text).toBe(todo.text);
    expect(res.body.todo.completed).toBe(todo.completed);
  });

  it('should update only the completed status', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({ completed: true })
      .expect(200);

    expect(res.body.todo.completed).toBe(true);
    expect(res.body.todo.text).toBe(todo.text);
    expect(res.body.todo.position).toBe(todo.position);
  });

  it('should update multiple fields at once', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({ text: 'Updated text', position: 3, completed: true })
      .expect(200);

    expect(res.body.todo.text).toBe('Updated text');
    expect(res.body.todo.position).toBe(3);
    expect(res.body.todo.completed).toBe(true);
  });

  it('should reject empty update', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({})
      .expect(400);

    expectValidationError(res);
  });

  it('should reject negative position', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    const res = await request(app)
      .patch(`${prefix}/todos/${todo.id}`)
      .set('Cookie', cookie)
      .send({ position: -1 })
      .expect(400);

    expectValidationError(res);
  });
});

describe('DELETE /todos/:id', () => {
  it('should return 400 for invalid todo id', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    await request(app).delete(`${prefix}/todos/invalid-id`).set('Cookie', cookie).expect(400);
  });

  it('should delete the todo from the database', async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie);

    await request(app).delete(`${prefix}/todos/${todo.id}`).set('Cookie', cookie).expect(204);

    const todosRes = await request(app).get(`${prefix}/todos`).set('Cookie', cookie).expect(200);

    expect(todosRes.body.todos).toHaveLength(0);
  });

  it("should not allow deleting another user's todo", async () => {
    const { cookie } = await createAuthenticatedUser(app);
    const todo = await createTodo(app, cookie, 'User 1 todo');

    const { cookie: cookie2 } = await createSecondUser(app);

    await request(app).delete(`${prefix}/todos/${todo.id}`).set('Cookie', cookie2).expect(403);
  });

  it('should return 404 when deleting non-existent todo', async () => {
    const { cookie } = await createAuthenticatedUser(app);

    await request(app)
      .delete(`${prefix}/todos/clhqxq9yj0000qz0ghwvw86e7`)
      .set('Cookie', cookie)
      .expect(404);
  });
});
