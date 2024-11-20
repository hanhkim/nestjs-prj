import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './expense.entity';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { FileModule } from 'src/file/file.module';
import { WalletModule } from 'src/wallets/wallet.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExpenseEntity]),
    FileModule,
    forwardRef(() => WalletModule),
    BullModule.registerQueue({
      name: 'image_optimize',
      prefix: 'flash-cards',
    }),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
  exports: [ExpenseService],
})
export class ExpenseModule {}
