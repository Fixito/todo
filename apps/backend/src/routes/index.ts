import { Router } from 'express';

import auth from './auth.routes.js';

export default () => {
  const app = Router();

  auth(app);

  return app;
};
