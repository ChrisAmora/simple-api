import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  public password: string;

  @IsString()
  public email: string;
}

export class CreateUserDto {
  @IsString()
  public fullName: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;
}
