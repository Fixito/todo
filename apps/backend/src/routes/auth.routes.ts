import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { validate } from '@/middlewares/validate.js';
import { type RegisterInput, registerSchema } from '@/schemas/auth.schema.js';
import AuthService from '@/services/auth.service.js';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post('/register', validate(registerSchema), async (req, res) => {
    const authServiceInstance = new AuthService();
    const { user, token } = await authServiceInstance.register(req.body as RegisterInput);

    res.status(StatusCodes.CREATED).json({ user, token });
  });

  route.post('/login', (_req, res) => {
    res.status(200).json({ message: 'Login successful' });
  });

  route.post('/logout', (_req, res) => {
    res.status(200).json({ message: 'Logout successful' });
  });
};
