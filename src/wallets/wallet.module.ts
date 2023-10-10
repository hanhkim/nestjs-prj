import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';

// actions for user
@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
