import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authService } from '@/lib/container.js';
import { setAuthCookie } from '@/lib/cookies.js';

import { validate } from '@/middlewares/validate.js';

import { type RegisterInput, registerSchema } from '@/schemas/auth.schema.js';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post('/register', validate(registerSchema), async (req, res) => {
    const { user, token } = await authService.register(req.body as RegisterInput);

    setAuthCookie(res, token);

    res.status(StatusCodes.CREATED).json({ user });
  });

  route.post('/login', (_req, res) => {
    res.status(200).json({ message: 'Login successful' });
  });

  route.post('/logout', (_req, res) => {
    res.status(200).json({ message: 'Logout successful' });
  });
};
