import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseEntity } from './expense.entity';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseEntity]), FileModule],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
