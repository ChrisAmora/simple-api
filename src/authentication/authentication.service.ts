import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { UserWithThatEmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';
import { WrongCredentialsException } from '../exceptions/wrong-credentials.exception';
import { DataStoredInToken } from '../interfaces/dataStoredInToken';
import { TokenData } from '../interfaces/tokenData.interface';
import { CreateUserDto, LoginUserDto } from '../user/user.dto';
import { User } from '../user/user.entity';

export class AuthenticationService {
  private userRepository = getRepository(User);

  public async login(userData: LoginUserDto) {
    const user = await this.userRepository.findOne({ where: { email: userData.email } });
    if (!user) {
      throw new WrongCredentialsException();
    }

    if (!bcrypt.compareSync(userData.password, user.password)) {
      throw new WrongCredentialsException();
    }
    user.password = null;
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user,
    };
  }

  public async register(userData: CreateUserDto) {
    if (await this.userRepository.findOne({ email: userData.email })) {
      throw new UserWithThatEmailAlreadyExistsException(userData.email);
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    await this.userRepository.save(user);
    user.password = null;
    const tokenData = this.createToken(user);
    const cookie = this.createCookie(tokenData);
    return {
      cookie,
      user,
    };
  }
  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
  public createToken(user: User): TokenData {
    const expiresIn = 60 * 60;
    const secret = process.env.JWT_SECRET;
    const dataStoredInToken: DataStoredInToken = {
      id: user.id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }
}
