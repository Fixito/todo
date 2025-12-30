import type { Request, Response } from 'express';

import env from '@/config/env.js';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000,
};

export function setAuthCookie(res: Response, token: string) {
  res.cookie('token', JSON.stringify(token), { ...COOKIE_OPTIONS, signed: true });
}

export function getAuthCookie(req: Request) {
  return req.signedCookies.token;
}

export function clearAuthCookie(res: Response) {
  res.clearCookie('token', COOKIE_OPTIONS);
}
