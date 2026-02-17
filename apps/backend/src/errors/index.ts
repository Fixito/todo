import { StatusCodes } from 'http-status-codes';

import { ErrorCode, type ErrorCodeType } from './error-codes.js';

export class HttpError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCodeType;
  public readonly isOperational = true;

  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    code: ErrorCodeType = ErrorCode.INTERNAL_ERROR,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = new.target.name;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class EmailAlreadyExistsError extends HttpError {
  constructor() {
    super('Email already in use', StatusCodes.CONFLICT, ErrorCode.CONFLICT);
  }
}

export class InvalidCredentialsError extends HttpError {
  constructor() {
    super('Invalid credentials', StatusCodes.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super('Unauthorized', StatusCodes.UNAUTHORIZED, ErrorCode.UNAUTHORIZED);
  }
}

export class NotFoundError extends HttpError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, StatusCodes.NOT_FOUND, ErrorCode.NOT_FOUND);
  }
}

export class ForbiddenError extends HttpError {
  constructor() {
    super('Forbidden', StatusCodes.FORBIDDEN, ErrorCode.FORBIDDEN);
  }
}

export type { ErrorCodeType } from './error-codes.js';
export { ErrorCode } from './error-codes.js';
