import { Response, Router } from 'express';
import { getRepository } from 'typeorm';
import { Controller } from '../interfaces/controller.interface';
import { RequestWithUser } from '../interfaces/requestWithUser.interface';
import { authMiddleware } from '../middleware/auth.middleware';
import { validationMiddleware } from '../middleware/validation.middleware';
import { CreateDocumentDto } from './document.dto';
import { Document } from './document.entity';

export class DocumentController implements Controller {
  public path = '/documents';
  public router = Router();
  private documentRepository = getRepository(Document);

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(this.path, authMiddleware, validationMiddleware(CreateDocumentDto), this.createDocument);
  }

  private createDocument = async (request: RequestWithUser, response: Response) => {
    const documentData: CreateDocumentDto = request.body;
    const newDocument = this.documentRepository.create({
      author: request.user,
      ip: request.ip,
      data: {
        birthdate: documentData.birthdate,
        cpf: documentData.cpf,
        rg: documentData.rg,
      },
    });
    await this.documentRepository.save(newDocument);
    newDocument.author = null;
    response.send(newDocument);
  };
}
