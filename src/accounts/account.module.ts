import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { WalletModule } from 'src/wallets/wallet.module';

//action for account such as login, logout
@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity]), WalletModule],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
