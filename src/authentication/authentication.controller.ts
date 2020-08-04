import * as express from 'express';
import { Controller } from '../interfaces/controller.interface';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateUserDto, LoginUserDto } from '../user/user.dto';
import { AuthenticationService } from './authentication.service';

export class AuthenticationController implements Controller {
  public path = '/auth';
  public router = express.Router();
  private authenticationService = new AuthenticationService();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/login`, validationMiddleware(LoginUserDto), this.login);
    this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
  }

  private login = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: LoginUserDto = request.body;
    try {
      const { cookie, user } = await this.authenticationService.login(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    const userData: CreateUserDto = request.body;
    try {
      const { cookie, user } = await this.authenticationService.register(userData);
      response.setHeader('Set-Cookie', [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };
}
