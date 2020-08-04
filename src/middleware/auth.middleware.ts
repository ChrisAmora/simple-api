import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { AuthenticationTokenMissingException } from '../exceptions/authentication-token-missing.exception';
import { WrongAuthenticationTokenException } from '../exceptions/wrong-authentication-token.exception';
import { DataStoredInToken } from '../interfaces/dataStoredInToken';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { User } from '../user/user.entity';

export const authMiddleware = async (request: RequestWithUser, _response: Response, next: NextFunction) => {
  const cookies = request.cookies;
  const userRepository = getRepository(User);
  if (cookies?.Authorization) {
    const secret = process.env.JWT_SECRET;
    try {
      const verificationResponse = jwt.verify(cookies.Authorization, secret) as DataStoredInToken;
      const id = verificationResponse.id;
      const user = await userRepository.findOne(id);
      if (user) {
        request.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
};
