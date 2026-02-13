import { Router } from 'express';

const route = Router();

export default (app: Router) => {
  app.use('/todos', route);

  route.get('/', (_req, res) => {
    res.json({ message: 'Get all todos' });
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
