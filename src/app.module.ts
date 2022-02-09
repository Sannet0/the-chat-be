import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './socket/socket.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      synchronize: true,
      logging: false,
      entities: [
        "dist/**/*.entity{.ts,.js}"
      ],
      autoLoadEntities: true
    }),
    SocketModule,
    ChatModule,
    MessageModule
  ],
  controllers: []
})
export class AppModule {}
