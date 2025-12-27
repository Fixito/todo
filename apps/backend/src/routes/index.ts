import { Router } from 'express';

import auth from './auth.js';

export default () => {
  const app = Router();

  auth(app);

  return app;
};
