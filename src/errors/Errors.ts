// src\errors\Errors.ts
export class AppError extends Error {
  statusCode: number;
  name: string;

  constructor(message: string, statusCode = 500, name = "AppError") {
    super(message);
    this.statusCode = statusCode;
    this.name = name;
  }
}
export class BaseError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    name: string,
    httpCode = 500,
    description = "Internal Server Error",
    isOperational = true
  ) {
    super(description);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

// 🔧 System & Environment Errors
export class EnvError extends BaseError {
  constructor(description = "Invalid or missing environment variable") {
    super("EnvError", 500, description, false);
  }
}
export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, 400, "BadRequestError");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UnauthorizedError");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "ForbiddenError");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, "NotFoundError");
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409, "ConflictError");
  }
}

export class InternalServerError extends AppError {
  constructor(message = "Internal Server Error") {
    super(message, 500, "InternalServerError");
  }
}
