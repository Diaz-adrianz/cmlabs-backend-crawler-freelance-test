import httpStatus from 'http-status';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../config/env.js';
import { ValidationError } from 'yup';
import { logger } from '../lib/logger/logger.js';

class HttpError extends Error {
  httpCode: number;
  stack?: string;

  constructor(message = 'An error occured', stack?: string) {
    super(message);
    this.name = this.constructor.name;
    this.httpCode = httpStatus.INTERNAL_SERVER_ERROR;
    this.stack = stack;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFound extends HttpError {
  constructor(message = 'Data not found') {
    super(message);
    this.httpCode = httpStatus.NOT_FOUND;
  }
}

class Unauthenticated extends HttpError {
  constructor(message = 'Authentication required') {
    super(message);
    this.httpCode = httpStatus.UNAUTHORIZED;
  }
}

class BadRequest extends HttpError {
  constructor(message = 'Invalid request data') {
    super(message);
    this.httpCode = httpStatus.BAD_REQUEST;
  }
}

class Forbidden extends HttpError {
  constructor(message = 'Access denied') {
    super(message);
    this.httpCode = httpStatus.FORBIDDEN;
  }
}

class ServerError extends HttpError {
  constructor(message = 'Internal server error') {
    super(message);
    this.httpCode = httpStatus.INTERNAL_SERVER_ERROR;
  }
}

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  let httpCode = err.httpCode || 500,
    message = err.message || 'Something went wrong',
    data = undefined;
  const stack = env.isDevelopment ? err?.stack?.split('\n') : undefined;

  if (env.isDevelopment) logger.warn('[DEV]', err);

  if (err instanceof ValidationError) {
    httpCode = httpStatus.UNPROCESSABLE_ENTITY;
    message = 'Validation failed';
    data = err.inner.map((i) =>
      i.errors
        .map((e) =>
          e.toLowerCase().includes(i.path?.toLowerCase() ?? '')
            ? e
            : `${i.path ?? ''}: ${e}`
        )
        .join(', ')
    );
  } else if (err instanceof HttpError) {
    httpCode = err.httpCode;
    message = err.message;
  } else {
    logger.error(err);
  }

  res.status(httpCode).json({
    status: httpCode > 199 && httpCode < 300,
    message: message,
    data: data,
    stack: stack,
  });
};

export {
  errorMiddleware,
  ServerError,
  NotFound,
  Unauthenticated,
  Forbidden,
  BadRequest,
};
