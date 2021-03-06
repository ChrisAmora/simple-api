import * as request from 'supertest';
import * as typeorm from 'typeorm';
import { App } from '../../app';
import { AuthenticationController } from '../../authentication/authentication.controller';
import { CreateUserDto } from '../../user/user.dto';

(typeorm as any).getRepository = jest.fn();

describe('The AuthenticationController', () => {
  describe('POST /auth/register', () => {
    describe('if the email is not taken', () => {
      it('response should have the Set-Cookie header with the Authorization token', () => {
        const userData: CreateUserDto = {
          fullName: 'testlino',
          email: 'test@gmail.com',
          password: '1234',
        };
        process.env.JWT_SECRET = 'jwt_secret';
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(null),
          create: () => ({
            ...userData,
            id: 0,
          }),
          save: () => Promise.resolve(),
        });
        const authenticationController = new AuthenticationController();
        const app = new App([authenticationController]);
        return request(app.getServer())
          .post(`${authenticationController.path}/register`)
          .send(userData)
          .expect('Set-Cookie', /^Authorization=.+/);
      });
    });
  });
});
