import 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }

    interface AuthenticatedRequest extends Request {
      user: {
        id: string;
        email: string;
      };
    }
  }
}
