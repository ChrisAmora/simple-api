import { HttpException } from './http.exception';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super(401, 'Wrong credentials provided');
  }
}
