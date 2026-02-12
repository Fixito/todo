import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { authService } from '@/lib/container.js';
import { clearAuthCookie, setAuthCookie } from '@/lib/cookies.js';

import { validate } from '@/middlewares/validate.js';

import {
  type LoginInput,
  loginSchema,
  type RegisterInput,
  registerSchema,
} from '@/schemas/auth.schema.js';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post('/register', validate(registerSchema), async (req, res) => {
    const { user, token } = await authService.register(req.body as RegisterInput);

    setAuthCookie(res, token);

    res.status(StatusCodes.CREATED).json({ user });
  });

  route.post('/login', validate(loginSchema), async (req, res) => {
    const { user, token } = await authService.login(req.body as LoginInput);

    setAuthCookie(res, token);

    res.status(StatusCodes.OK).json({ user });
  });

  route.post('/logout', (_req, res) => {
    clearAuthCookie(res);
    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' });
  });
};
