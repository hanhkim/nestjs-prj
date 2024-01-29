import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CategoryModule } from 'src/categories/category.module';

// actions for user
@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity]), CategoryModule],
  controllers: [WalletController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}
