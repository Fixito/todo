import { Router } from 'express';

import auth from './auth.routes.js';
import todos from './todo.routes.js';

export default () => {
  const app = Router();

  auth(app);
  todos(app);

  return app;
};
