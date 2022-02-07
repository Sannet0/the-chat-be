import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { nanoid } from 'nanoid';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  }
})
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('AppGateway');

  afterInit(server: any) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: any, ...args): any {
    this.logger.log('User Connect , id: ' + client.id);
  }

  handleDisconnect(client: any): any {
    this.logger.log('User Disconnect, id: ' + client.id);
  }

  @SubscribeMessage('msgToServer')
  handleMessage(client: Server, message: { user_id: string, text: string }): any {
    const id = nanoid();
    this.server.emit('msgToClient', { ...message, id });
  }
}
