import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity';

@Entity('chats')
export class Chat {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
