import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entity/message.entity';
import { Chat } from '../entity/chat.entity';

@Injectable()
export class MessageService {

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Chat) private chatRepository: Repository<Chat>
  ) { }

  async getAllMessages(chatName: string): Promise<{ user_id: string, user_name: string, text: string, id: string } | HttpException> {
    try {
      const chats = await this.chatRepository.query(`SELECT chats.id FROM chats WHERE name = '${ chatName }'`);

      if(chats.length === 0) {
        throw new HttpException('no such chat', HttpStatus.NOT_FOUND);
      }

      const chat_id = chats[0].id;

      return await this.messageRepository.query(`
        SELECT messages.id, messages.text, messages.user_id, usr.login AS "user_name" FROM messages 
        JOIN (SELECT * FROM chats) chat ON chat.id = messages.chat_id
        JOIN (SELECT * FROM users) usr ON usr.id = messages.user_id
        WHERE chat_id = ${ chat_id }`
      );
    } catch (err) {
      throw new HttpException(err.detail || err.response || 'something wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async newMessage(chatName: string, message: { user_id: string, text: string }): Promise<string> {
    try {
      const chats = await this.chatRepository.query(`SELECT chats.id FROM chats WHERE name = '${ chatName }'`);

      if(chats.length === 0) {
        throw new HttpException('no such chat', HttpStatus.NOT_FOUND);
      }

      const chat_id = chats[0].id;

      const newMessage = await this.messageRepository.query(`
      INSERT INTO messages ("text", "user_id", "chat_id") 
      VALUES ('${ message.text }', ${ message.user_id }, ${ chat_id })
      RETURNING id`
      );

      return newMessage[0].id;
    } catch (err) {
      throw new HttpException(err.detail || err.response || 'something wrong', HttpStatus.BAD_REQUEST);
    }
  }
}
