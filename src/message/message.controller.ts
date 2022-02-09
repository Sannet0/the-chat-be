import { Controller, Get, HttpException, Param, Post } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {

  constructor(private readonly messageService: MessageService) {
  }

  @Get(':chatName')
  async getAllMessage (@Param() param): Promise<{ user_id: string, user_name: string, text: string, id: string } | HttpException> {
    const { chatName } = param;
    return await this.messageService.getAllMessages(chatName);
  }

}
