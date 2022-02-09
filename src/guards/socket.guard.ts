import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class SocketGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();

    try {
      const authHeader: string[] = client.handshake.auth.token.split(' ');
      const type: string = authHeader[0];
      const token: string = authHeader[1];
      client.user = this.jwtService.verify(token);

      return type === 'Bearer';
    } catch (err) {
      throw new HttpException('unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
