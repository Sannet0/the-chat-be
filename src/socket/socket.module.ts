import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SocketGateway } from './socket.gateway';
import { MessageModule } from '../message/message.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    JwtModule.register({
      secret: '' + process.env.JWT_SECRET
    }),
    MessageModule,
    ChatModule
  ],
  providers: [
    SocketGateway
  ]
})
export class SocketModule {}
