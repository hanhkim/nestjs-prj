import { MysqlBaseService } from 'src/common/mysql/base.service';
import { ExpenseEntity } from './expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseDto } from './expense.dto';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';
import { CategoryDto } from 'src/categories/category.dto';
import { WalletService } from 'src/wallets/wallet.service';

export class ExpenseService extends MysqlBaseService<ExpenseEntity> {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
    private readonly walletService: WalletService,
  ) {
    super(expenseRepository);
  }

  async save(expense: ExpenseDto): Promise<ExpenseDto> {
    const savedUser = await this.expenseRepository.save(expense);

    await this.walletService.calculateWalletBalance(
      expense.walletId,
      expense.categoryId,
      expense.amount,
    );

    return plainToInstance(ExpenseDto, savedUser, {
      excludeExtraneousValues: true,
    });
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
