import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AccountService } from 'src/accounts/account.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, password: string): Promise<any> {
    const account = await this.accountService.login(email, password);
    console.log(account, account?.password, password);
    if (account?.password !== password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: account.id, username: account.username };
    // TODO: Generate a JWT and return it here
    // instead of the user object
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
