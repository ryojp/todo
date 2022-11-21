import { Router, Request, Response, NextFunction } from "express";

export const router = Router();

// HttpError derives from Error with statusCode
export class HttpError extends Error {
  statusCode: number;

  constructor(message: string, status_code?: number) {
    super(message);
    this.statusCode = status_code || 500;
  }
}

// log the error and send the error content back
export const errorHandler = (
  err: HttpError,
  _: Request,
  res: Response<{ error: string }>,
  next: NextFunction
) => {
  console.log(err.stack);
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.statusCode).send({ error: err.message });
};
