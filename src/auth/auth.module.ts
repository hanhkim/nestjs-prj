import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { RefreshTokenStrategy } from './strategies/refreshToken.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AccountModule } from 'src/accounts/account.module';
import { ConfigService } from '@nestjs/config';
import { WalletModule } from 'src/wallets/wallet.module';

@Module({
  imports: [AccountModule, JwtModule.register({}), WalletModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
    ConfigService,
  ],
})
export class AuthModule {}
