import type { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';

export function notFound(_req: Request, res: Response, _next: NextFunction) {
  return res.status(StatusCodes.NOT_FOUND).json({
    error: 'NotFound',
    message: 'The requested resource was not found.',
  });
}
