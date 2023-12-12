import { MysqlBaseService } from 'src/common/mysql/base.service';
import { ExpenseEntity } from './expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseDto } from './expense.dto';
import { plainToInstance } from 'class-transformer';
import * as dayjs from 'dayjs';

export class ExpenseService extends MysqlBaseService<ExpenseEntity> {
  constructor(
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepository: Repository<ExpenseEntity>,
  ) {
    super(expenseRepository);
  }

  async save(expense: ExpenseDto): Promise<ExpenseDto> {
    const savedUser = await this.expenseRepository.save(expense);

    return plainToInstance(ExpenseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async getTransactionList(month): Promise<any> {
    const startDate = dayjs(`2023-${month}-01`);
    const endDate = startDate.endOf('month');

    const list = await this.expenseRepository
      .createQueryBuilder('expense')
      .where('expense.date BETWEEN :startDate AND :endDate', {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      })
      .leftJoinAndSelect('expense.category', 'category')
      .orderBy('expense.date', 'DESC')
      .getMany();

    return list;
  }
}
