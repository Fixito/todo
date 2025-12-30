import { pinoHttp } from 'pino-http';

import { logger } from '@/config/logger.js';

export const httpLogger = pinoHttp({
  logger,

  autoLogging: {
    ignore: (req) => req.url === '/health',
  },

  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 400) return 'silent';
    return 'info';
  },

  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} ${res.statusCode}`;
  },

  customErrorMessage: (req, res, err) => {
    return `${req.method} ${req.url} ${res.statusCode} - ${err.message}`;
  },

  customAttributeKeys: {
    req: 'request',
    res: 'response',
    err: 'error',
    responseTime: 'duration',
  },

  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      query: req.query,
      params: req.params,
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});
