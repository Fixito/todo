import { Router } from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post('/register', (_req, res) => {
    res.status(201).json({ message: 'Registration successful' });
  });

  route.post('/login', (_req, res) => {
    res.status(200).json({ message: 'Login successful' });
  });

  route.post('/logout', (_req, res) => {
    res.status(200).json({ message: 'Logout successful' });
  });
};
