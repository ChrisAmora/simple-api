import * as request from 'supertest';
import * as typeorm from 'typeorm';
import { App } from '../../app';
import { DocumentController } from '../../document/document.controller';
import { CreateDocumentDto } from '../../document/document.dto';
import { AuthenticationTokenMissingException } from '../../exceptions/AuthenticationTokenMissingException';
import { authMiddleware } from '../../middleware/auth.middleware';
import { User } from '../../user/user.entity';
import { mockRequest } from '../../utils/test.utils';
jest.mock('../../middleware/auth.middleware');

(typeorm as any).getRepository = jest.fn();

beforeEach(() => {
  (authMiddleware as any).mockImplementation(async (_request, _response, next) => {
    next();
  });
});

describe('DocumentController', () => {
  describe('POST /documents', () => {
    describe('if user is authenticated', () => {
      it('response should have a document without author', () => {
        const userData: CreateDocumentDto = {
          birthdate: '01/01/1970',
          cpf: '12523658029',
          rg: '21291901',
        };
        const user = new User();
        const req = mockRequest({ ...userData, user });

        (typeorm as any).getRepository.mockReturnValue({
          create: () => ({
            data: {
              birthdate: req.birthdate,
              cpf: req.cpf,
              rg: req.rg,
            },
            id: 0,
            ip: req.ip,
            author: req.user,
          }),
          save: () => Promise.resolve(),
        });
        const documentController = new DocumentController();
        const app = new App([documentController]);
        return request(app.getServer())
          .post(`${documentController.path}`)
          .send(userData)
          .expect({ data: userData, id: 0, ip: req.ip, author: null });
      });
    });
    describe('if user is not authenticated', () => {
      it('should throw an error', () => {
        (authMiddleware as any).mockImplementation(async (_request, _response, next) => {
          next(new AuthenticationTokenMissingException());
        });
        const userData: CreateDocumentDto = {
          birthdate: '01/01/1970',
          cpf: '12523658029',
          rg: '21291901',
        };
        const req = mockRequest(userData);

        (typeorm as any).getRepository.mockReturnValue({
          create: () => ({
            data: {
              birthdate: req.birthdate,
              cpf: req.cpf,
              rg: req.rg,
            },
            id: 0,
            ip: req.ip,
            author: undefined,
          }),
          save: () => Promise.resolve(),
        });
        const documentController = new DocumentController();
        const app = new App([documentController]);
        return request(app.getServer()).post(`${documentController.path}`).send(userData).expect(401);
      });
    });
  });
});
