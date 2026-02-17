import { StatusCodes } from 'http-status-codes';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly isOperational = true;

  constructor(message: string, statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.name = new.target.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class EmailAlreadyExistsError extends HttpError {
  constructor() {
    super('Email already in use', StatusCodes.CONFLICT);
  }
}

export class InvalidCredentialsError extends HttpError {
  constructor() {
    super('Invalid credentials', StatusCodes.UNAUTHORIZED);
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super('Unauthorized', StatusCodes.UNAUTHORIZED);
  }
}

export class NotFoundError extends HttpError {
  constructor() {
    super('Todo not found', StatusCodes.NOT_FOUND);
  }
}

export class ForbiddenError extends HttpError {
  constructor() {
    super('Forbidden', StatusCodes.FORBIDDEN);
  }
}
