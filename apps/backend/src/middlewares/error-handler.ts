import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { ZodError } from 'zod';

import env from '@/config/env.js';
import { ErrorCode } from '@/errors/error-codes.js';
import { HttpError } from '@/errors/index.js';

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    req.log.error({ err, statusCode: StatusCodes.BAD_REQUEST }, 'Validation failed');

    return res.status(StatusCodes.BAD_REQUEST).json({
      error: {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        ...(env.NODE_ENV === 'development' && { stack: err.stack }),
      },
    });
  }

  const statusCode = err instanceof HttpError ? err.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  const code = err instanceof HttpError ? err.code : ErrorCode.INTERNAL_ERROR;

  req.log.error({ err, statusCode }, err.message);

  return res.status(statusCode).json({
    error: {
      code,
      message: err.message,
      ...(env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
}
