import { Request, Response } from 'express';
import { HttpException } from '../exceptions/HttpException';

export function errorMiddleware(error: HttpException, _request: Request, response: Response) {
  const status = error.status ?? 500;
  const message = error.message ?? 'internal error';
  response.status(status).send({
    message,
    status,
  });
}
