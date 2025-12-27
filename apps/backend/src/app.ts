import cors from 'cors';
import express from 'express';

import config from './config/env.js';

import { errorHandler } from './middleware/error-handler.js';
import { httpLogger } from './middleware/http-logger.js';
import { notFound } from './middleware/not-found.js';

import routes from './routes/index.js';

export function createApp() {
  const app = express();

  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK' });
  });

  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);
  app.use(config.api.prefix, routes());

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
