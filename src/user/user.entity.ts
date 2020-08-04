import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from '../document/document.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public fullName: string;

  @Column({ nullable: false, unique: true })
  public email: string;

  @Column()
  public password: string;

  @OneToMany(() => Document, (document: Document) => document.author)
  public documents: Document[];
}
