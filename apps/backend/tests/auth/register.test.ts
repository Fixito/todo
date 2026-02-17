import { createApp } from '../../src/app.js';
import { invalidEmailUser, validUser } from '../fixtures/users.js';
import { createUser, expectAuthSuccess } from '../helpers/auth-helpers.js';

const app = createApp();

describe('POST /auth/register', () => {
  it('should register a new user', async () => {
    const res = await createUser(app, validUser).expect(201);

    expectAuthSuccess(res, validUser.email);
  });

  it('should reject duplicate email', async () => {
    await createUser(app, validUser);

    const res = await createUser(app, validUser).expect(409);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('CONFLICT');
    expect(res.body.error.message).toBe('Email already in use');
  });

  it('should reject invalid payload', async () => {
    await createUser(app, invalidEmailUser).expect(400);
  });
});
