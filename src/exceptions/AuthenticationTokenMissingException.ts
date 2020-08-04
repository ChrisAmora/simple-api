import { HttpException } from '../exceptions/HttpException';

export class AuthenticationTokenMissingException extends HttpException {
  constructor() {
    super(401, 'Missing authentication token');
  }
}
