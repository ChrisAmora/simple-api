import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

interface Data {
  birthdate: string;
  cpf: string;
  rg: string;
}

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  public id: number;

  @ManyToOne(() => User, (author: User) => author.documents)
  public author: User;

  @Column({ nullable: true })
  public ip?: string;

  @Column({ type: 'jsonb' })
  data: Data;
}
