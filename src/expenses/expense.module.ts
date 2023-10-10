import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './expense.entity';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
