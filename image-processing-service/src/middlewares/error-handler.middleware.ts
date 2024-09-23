import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@utils/errors.utils';

export const apiErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error(err);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        status: err.statusCode,
      },
    });
  }

  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      status: 500,
    },
  });
};

export const asyncProcessErrorHandler = (error: any): void => {
  console.error(`Error caught by handler: ${error.name} - ${error.message}`);

  if (error instanceof CustomError) {
    console.error('Custom error occurred:', error.message);
    console.error(error.name);
    console.error(error.message);
    console.error(error.stack);
    return;
  }

  throw new Error('Unexpected error occurred');
};
