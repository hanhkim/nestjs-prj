import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AccountService } from 'src/accounts/account.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountDto } from 'src/accounts/account.dto';

@Injectable()
export class AuthService {
  constructor(
    private accountService: AccountService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<any> {
    const account = await this.accountService.getUserByEmail(email);

    if (!account) {
      throw new BadRequestException('User does not exist');
    }

    const passwordMatches = account?.password === password;

    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }

    const tokens = await this.getTokens(account.id, account.email);

    await this.updateRefreshToken(account.id, tokens.refreshToken);

    return tokens;
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getToken(userId, username, 'accessToken'),
      this.getToken(userId, username, 'refreshToken'),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async getToken(
    userId,
    username,
    typeAccess: 'accessToken' | 'refreshToken',
  ): Promise<string> {
    const accessOptions = {
      secret:
        typeAccess === 'accessToken'
          ? 'KEY_ACCESS_TOKEN_HALI_123'
          : 'KEY_REFRESH_TOKEN_HALI_123',
      expiresIn: '30m',
    };

    const refreshOptions = {
      secret: 'KEY_REFRESH_TOKEN_HALI_123',
      expiresIn: '2h',
    };

    const options =
      typeAccess === 'accessToken' ? accessOptions : refreshOptions;

    return this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      { ...options },
    );
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.accountService.updateRefreshToken(userId, refreshToken);
  }

  async logout(userId: string) {
    return await this.updateRefreshToken(userId, null);
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.accountService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('User Not found');
    const refreshTokenMatches = user.refreshToken === refreshToken;
    if (!refreshTokenMatches)
      throw new ForbiddenException('Access Denied not match');

    // do we need to check the refreshToken expired here?
    // nope because when refreshToken is expired,then cannot pass the guard to come here

    const newAccessToken = await this.getToken(
      user.id,
      user.email,
      'accessToken',
    );

    return {
      accessToken: newAccessToken,
      refreshToken,
    };
  }

  async register(createAccountDto: AccountDto): Promise<{ id: string }> {
    // check email existed
    const user = await this.accountService.getUserByEmail(
      createAccountDto.email,
    );

    if (user) {
      throw new BadRequestException('User has existed');
    }

    const newAccount = await this.accountService.save(createAccountDto);

    // const newWallet: WalletDto = {
    //   id: null,
    //   name: 'Ví tiêu dùng',
    //   amount: 0,
    //   description: 'Ví tiêu dùng cá nhân, hằng ngày',
    //   imgUrl: null,
    //   isDefault: true,
    //   setting: {
    //     backgroundColor: 'blue',
    //     textColor: 'white',
    //   },
    // };

    return { id: newAccount.id };
  }

  async getProfile(userId: string) {
    return await this.accountService.getProfile(userId);
  }
}
