import { createApp } from '../../src/app.js';
import { invalidEmailUser, validUser } from '../fixtures/users.js';
import { createUser, expectAuthSuccess, loginUser } from '../helpers/auth-helpers.js';

const app = createApp();

describe('POST /auth/login', () => {
  it('should login a new user', async () => {
    await createUser(app, validUser);

    const res = await loginUser(app, validUser).expect(200);

    expectAuthSuccess(res, validUser.email);
  });

  it('should reject invalid payload', async () => {
    await loginUser(app, invalidEmailUser).expect(400);
  });

  it('should reject bad password', async () => {
    await createUser(app, validUser);

    const res = await loginUser(app, {
      ...validUser,
      password: 'bad-password',
    }).expect(401);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.error.message).toBe('Invalid credentials');
  });

  it('should reject non existing email', async () => {
    const res = await loginUser(app, {
      email: 'nonexistent@test.com',
      password: 'some-password',
    }).expect(401);

    expect(res.body.error).toBeDefined();
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.error.message).toBe('Invalid credentials');
  });
});
