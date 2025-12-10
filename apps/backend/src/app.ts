import express from 'express';

import { errorHandler } from './middleware/error-handler.js';
import { httpLogger } from './middleware/http-logger.js';
import { notFound } from './middleware/not-found.js';

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(httpLogger);

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
