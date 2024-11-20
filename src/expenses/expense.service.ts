import { MysqlBaseService } from 'src/common/mysql/base.service';
import { ExpenseEntity } from './expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseDto } from './expense.dto';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { CategoryDto } from 'src/categories/category.dto';
import { WalletService } from 'src/wallets/wallet.service';
import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class ExpenseService extends MysqlBaseService<ExpenseEntity> {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
    @Inject(forwardRef(() => WalletService))
    private readonly walletService: WalletService,
  ) {
    super(expenseRepository);
  }

  async save(expense: ExpenseDto): Promise<ExpenseDto> {
    const savedExpense = await this.expenseRepository.save(expense);

    await this.walletService.calculateWalletBalance(
      expense.walletId,
      expense.categoryId,
      expense.amount,
    );

    return plainToInstance(ExpenseDto, savedExpense, {
      excludeExtraneousValues: true,
    });
  }

  async saveWithoutCalculateWallet(expense: ExpenseDto): Promise<ExpenseDto> {
    const savedExpense = await this.expenseRepository.save(expense);

    return plainToInstance(ExpenseDto, savedExpense, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, data: ExpenseDto): Promise<string> {
    const expense = await this.expenseRepository.findOneBy({
      id,
      deletedAt: null,
    });

    console.log('expense :>> ', expense, data.amount);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    if (expense.categoryId != data.categoryId) {
      await this.walletService.calculateWalletBalance(
        expense.walletId,
        expense.categoryId,
        -expense.amount,
      );

      await this.walletService.calculateWalletBalance(
        expense.walletId,
        data.categoryId,
        data.amount,
      );

      await this.expenseRepository.update(id, data);
    } else {
      const amountDiff = +data.amount - expense.amount;

      if (expense.amount !== data.amount) {
        await this.walletService.calculateWalletBalance(
          expense.walletId,
          expense.categoryId,
          amountDiff,
        );
      }
    }

    const newData = await this.expenseRepository.update(id, data);

    if (!newData) {
      throw new Error('Cannot save data');
    }

    return 'updated successful';
  }

  async getTransactionList(
    userId: string,
    month: string,
    walletId?: string,
  ): Promise<any> {
    const startDate = dayjs(`2024-${month}-01`);
    const endDate = startDate.endOf('month');

    const queryBuilder = this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.userId=:userId', {
        userId: userId,
      })
      .andWhere('expense.deleted_at IS NULL')
      .andWhere('expense.date BETWEEN :startDate AND :endDate', {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
      .leftJoinAndSelect('expense.category', 'category')
      .orderBy('expense.date', 'DESC');

    if (walletId) {
      queryBuilder.andWhere('expense.walletId=:walletId', { walletId });
    }

    const list = await queryBuilder.getMany();

    return list;
  }
}
