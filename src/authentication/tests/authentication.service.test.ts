import { hash } from 'bcrypt';
import * as typeorm from 'typeorm';
import { User } from 'user/user.entity';
import { AuthenticationService } from '../../authentication/authentication.service';
import { UserWithThatEmailAlreadyExistsException } from '../../exceptions/UserWithThatEmailAlreadyExistsException';
import { WrongCredentialsException } from '../../exceptions/WrongCredentialsException';
import { TokenData } from '../../interfaces/tokenData.interface';
import { CreateUserDto, LoginUserDto } from '../../user/user.dto';

(typeorm as any).getRepository = jest.fn();

describe('The AuthenticationService', () => {
  describe('when creating a cookie', () => {
    it('should return a string', () => {
      const tokenData: TokenData = {
        token: '',
        expiresIn: 1,
      };
      (typeorm as any).getRepository.mockReturnValue({});
      const authenticationService = new AuthenticationService();
      expect(typeof authenticationService.createCookie(tokenData)).toEqual('string');
    });
  });
  describe('when login an user', () => {
    describe('if email is not found', () => {
      it('should throw an error', async () => {
        const userData: LoginUserDto = {
          email: 'test@gmail.com',
          password: 'testpassword',
        };
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(null),
        });
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.login(userData)).rejects.toMatchObject(new WrongCredentialsException());
      });
    });
    describe('if email is found and the password is correct', () => {
      it('should not throw an error', async () => {
        process.env.JWT_SECRET = 'jwt_secret';
        const userData: LoginUserDto = {
          email: 'test@gmail.com',
          password: 'test',
        };
        const hashedPassword = await hash(userData.password, 10);
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () =>
            Promise.resolve<User>({
              id: '5',
              email: 'test@gmail.com',
              fullName: 'test',
              password: hashedPassword,
            }),
        });
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.login(userData)).resolves.toBeDefined();
      });
    });
    describe('if email is found and the password is incorrect', () => {
      it('should throw an error', async () => {
        const userData: LoginUserDto = {
          email: 'test@gmail.com',
          password: 'wrong',
        };
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () =>
            Promise.resolve<User>({
              id: '5',
              email: 'test@gmail.com',
              fullName: 'test',
              password: 'hashed',
            }),
        });
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.login(userData)).rejects.toMatchObject(new WrongCredentialsException());
      });
    });
  });
  describe('when registering an user', () => {
    describe('if the email is already taken', () => {
      it('should throw an error', async () => {
        const userData: CreateUserDto = {
          fullName: 'testlino',
          email: 'test@gmail.com',
          password: 'testpassword',
        };
        (typeorm as any).getRepository.mockReturnValue({
          findOne: () => Promise.resolve(userData),
        });
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.register(userData)).rejects.toMatchObject(
          new UserWithThatEmailAlreadyExistsException(userData.email),
        );
      });
    });
    describe('if the email is not taken', () => {
      it('should not throw an error', async () => {
        const userData: CreateUserDto = {
          fullName: 'testlino',
          email: 'test@gmail.com',
          password: 'testpassword',
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
        const authenticationService = new AuthenticationService();
        await expect(authenticationService.register(userData)).resolves.toBeDefined();
      });
    });
  });
});
