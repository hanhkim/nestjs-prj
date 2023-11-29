import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IS_PUBLIC_KEY } from './constants';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';

const refreshRoute = '/auth/refresh';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const { url } = request;

    const accessToken = this.extractTokenFromHeader(request);

    console.log('accessToken :>> ', accessToken);
    // can't find accessToken => return Unauthorized
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    // check refreshToken is valid, return true
    if (url.includes(refreshRoute)) {
      const refreshToken = this.extractRefrestTokenFromHeader(request);

      if (!refreshToken) {
        throw new UnauthorizedException();
      }

      const validate = await this.validateRefreshToken(refreshToken, request);
      return validate;
    } else {
      // validate accessToken

      const validate = await this.validateAccessToken(accessToken, request);

      return validate;
    }
  }

  private async validateRefreshToken(token: string, request: Request) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.ACCESS_TOKEN}`,
      });

      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async validateAccessToken(token: string, request: Request) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: `${process.env.ACCESS_TOKEN}`,
      });

      request['user'] = payload;

      return true;
    } catch (error) {
      if (error.message == 'jwt expired') {
        throw {
          statusCode: 401,
          message: 'jwt expired',
        };
      }
      return error;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractRefrestTokenFromHeader(request: Request): string {
    const refreshToken = request.headers['r-token'];
    console.log('refreshToken :>> ', refreshToken);
    return refreshToken as string;
  }
}
