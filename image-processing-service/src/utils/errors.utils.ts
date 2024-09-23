export class CustomError extends Error {
  statusCode: number;
  name: string;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string = 'Bad Request') {
    super(message, 400);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string = 'Forbidden') {
    super(message, 403);
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Not Found') {
    super(message, 404);
  }
}

export class S3Error extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'S3Error';
  }
}

export class ThumbnailCreationError extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'ThumbnailCreationError';
  }
}

export class EmailError extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'EmailError';
  }
}

export class SQSError extends CustomError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'SQSError';
  }
}
