import { Router } from 'express';

import { UnauthorizedError } from '@/errors/index.js';

import { todoService } from '@/lib/container.js';

import { requireAuth } from '@/middlewares/authenticate.js';
import { validate } from '@/middlewares/validate.js';

import { todoSchema } from '@/schemas/todo.schema.js';

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

  route.post('/', requireAuth, validate(todoSchema), async (req, res) => {
    if (!req.user) {
      throw new UnauthorizedError();
    }

    const todo = await todoService.createTodo(req.user.id, req.body.text);

    res.json({ todo });
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
