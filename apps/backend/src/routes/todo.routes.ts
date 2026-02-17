import { Router } from 'express';
import { StatusCodes } from 'http-status-codes';

import { todoService } from '@/lib/container.js';

import { requireAuth } from '@/middlewares/authenticate.js';
import { validate } from '@/middlewares/validate.js';

import { todoParamsSchema, todoSchema } from '@/schemas/todo.schema.js';

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

  route.put('/:id', requireAuth, validate(todoParamsSchema, 'params'), (req, res) => {
    const { id } = req.params as { id: string };
    res.json({ message: `Update todo with id ${id}`, data: req.body });
  });

  route.delete('/:id', requireAuth, validate(todoParamsSchema, 'params'), async (req, res) => {
    const { user } = req as Express.AuthenticatedRequest;
    const { id } = req.params as { id: string };

    await todoService.deleteTodo(user.id, id);

    res.status(StatusCodes.OK).json({ message: `Delete todo with id ${id}` });
  });
};
