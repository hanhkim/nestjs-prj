import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/accounts/account.service';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from 'src/accounts/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const account = await this.accountService.login(email, password);

    if (account?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = this.getPayload(account);

    return {
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '600s' }),
    };
  }

  getPayload(user: AccountEntity) {
    const payload = { id: user.id, username: user.email };
    return payload;
  }

  async refreshToken(user: AccountEntity): Promise<any> {
    const payload = this.getPayload(user);

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
