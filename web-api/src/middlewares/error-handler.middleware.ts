import { Request, Response, NextFunction } from 'express';
import { CustomError } from '@utils/errors.utils';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      message: err.message,
      status: err.statusCode,
    });
  }

  return res.status(500).json({
    message: 'Internal Server Error',
    status: 500,
  });
};
