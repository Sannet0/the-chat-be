import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketGuard } from '../guards/socket.guard';
import { MessageService } from '../message/message.service';
import { ChatService } from '../chat/chat.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  }
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly messageService: MessageService,
    private readonly chatService: ChatService
  ) { }

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: any, ...args): any {
    const { room, user_name } = client.handshake.query;
    client.join(room);
    this.logger.log(`User Connect, room: ${ room }, id: ${ client.id }`)

    const userInChat = this.chatService.newUserInChat(room, user_name);
    this.server.emit(`newUserInChat.${ room }`, userInChat)
  }

  handleDisconnect(client: any): any {
    const { room, user_name } = client.handshake.query;
    this.logger.log(`User Connect, room: ${ room }, id: ${ client.id }`);

    const userInChat = this.chatService.removeUser(room, user_name);
    this.server.emit(`newUserInChat.${ room }`, userInChat)
  }

  @UseGuards(SocketGuard)
  @SubscribeMessage('msgToServer')
  async handleMessage(client: any, text: string): Promise<any> {
    const { room } = client.handshake.query;
    const messageId = await this.messageService.newMessage(room, { user_id: client.user.id, text });
    this.server.to(room).emit('msgToClient', { user_id: client.user.id, user_name: client.user.login, text, id: messageId });
  }

  @UseGuards(SocketGuard)
  @SubscribeMessage('createNewChat')
  async createNewChat(client: any, chatName: string) {
    await this.chatService.createNewChat(chatName);
    this.server.emit('newChatCreated', chatName);
  }
}
