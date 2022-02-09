import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from '../entity/chat.entity';

@Injectable()
export class ChatService {

  chats: any = { };

  constructor(@InjectRepository(Chat) private readonly chatRepository: Repository<Chat>) {
  }

  async getAllChats(): Promise<string[]> {
    try {
      const chats = await this.chatRepository.query(`SELECT chats.name FROM chats`);

      const chatsNames: string[] = [];
      chats.forEach((chat) => {
        chatsNames.push(chat.name);
      });

      return chatsNames;
    } catch (err) {
      throw new HttpException(err.detail || err.response || 'something wrong', HttpStatus.BAD_REQUEST);
    }
  }

  async createNewChat(chatName: string): Promise<void> {
    try {
      await this.chatRepository.query(`INSERT INTO chats ("name") VALUES ('${ chatName }')`);
    } catch (err) {
      throw new HttpException(err.detail || err.response || 'something wrong', HttpStatus.BAD_REQUEST);
    }
  }

  newUserInChat(room: string, user_name: string): string[] {
    if (!this.chats[room]) {
      this.chats[room] = [user_name];
    } else {
      this.chats[room].push(user_name);
    }

    return this.chats[room];
  }

  removeUser(room: string, user_name: string): string[] {
    this.chats[room] = this.chats[room].filter(username => username !== user_name);
    return this.chats[room];
  }
}
