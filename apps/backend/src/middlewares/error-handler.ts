import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import env from '@/config/env.js';
import { HttpError } from '@/errors/index.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    req.log.error({ err, statusCode: StatusCodes.BAD_REQUEST }, 'Validation failed');

    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const statusCode = err instanceof HttpError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;

  req.log.error({ err, statusCode }, err.message);

  return res.status(statusCode).json({
    error: err.name,
    message: err.message,
    stack: env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
