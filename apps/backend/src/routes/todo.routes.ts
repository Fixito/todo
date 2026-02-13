import { Router } from 'express';

import { UnauthorizedError } from '@/errors/index.js';

import { todoService } from '@/lib/container.js';

import { requireAuth } from '@/middlewares/authenticate.js';

const route = Router();

export default (app: Router) => {
  app.use('/todos', route);

  route.get('/', requireAuth, async (req, res) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const todos = await todoService.getUserTodos(req.user.id);

    res.json({ todos });
  });

  route.post('/', (req, res) => {
    res.json({ message: 'Create a new todo', data: req.body });
  });

  route.get('/:id', (req, res) => {
    res.json({ message: `Get todo with id ${req.params.id}` });
  });

  route.put('/:id', (req, res) => {
    res.json({ message: `Update todo with id ${req.params.id}`, data: req.body });
  });

  route.delete('/:id', (req, res) => {
    res.json({ message: `Delete todo with id ${req.params.id}` });
  });
};
