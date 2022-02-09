import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('messages')
export class Message {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  user_id: number;

  @Column()
  chat_id: number;
}
