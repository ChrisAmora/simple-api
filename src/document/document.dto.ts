import { IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  public birthdate: string;

  @IsString()
  public cpf: string;

  @IsString()
  public rg: string;
}
