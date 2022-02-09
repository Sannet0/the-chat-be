import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { Message } from '../entity/message.entity';
import { Chat } from '../entity/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Chat]),
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService]
})
export class MessageModule {}
