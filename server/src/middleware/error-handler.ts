import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error: unknown, _req: Request, res: Response, next: NextFunction) {
  void next;
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.flatten().fieldErrors
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      details: error.details
    });
  }

  logger.error({ error }, 'Unhandled application error');

  return res.status(500).json({
    message: 'Internal server error'
  });
}
