import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { todoService } from '@/lib/container.js';

import { requireAuth } from '@/middlewares/authenticate.js';
import { validate } from '@/middlewares/validate.js';

import { todoSchema } from '@/schemas/todo.schema.js';

const route = Router();

export default (app: Router) => {
  app.use('/todos', route);

  route.get('/', requireAuth, async (req, res) => {
    const { user } = req as Express.AuthenticatedRequest;
    const todos = await todoService.getUserTodos(user.id);

    res.status(StatusCodes.OK).json({ todos });
  });

  route.post('/', requireAuth, validate(todoSchema), async (req, res) => {
    const { user } = req as Express.AuthenticatedRequest;
    const todo = await todoService.createTodo(user.id, req.body.text);

    res.status(StatusCodes.CREATED).json({ todo });
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
