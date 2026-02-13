import type { NextFunction, Request, Response } from 'express';

import { UnauthorizedError } from '@/errors/index.js';

import { getAuthCookie } from '@/lib/cookies.js';
import { verifyToken } from '@/lib/jwt.js';

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = getAuthCookie(req);

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    const payload = verifyToken(token);
    req.user = payload;
  } catch {
    throw new UnauthorizedError();
  }

  next();
}
