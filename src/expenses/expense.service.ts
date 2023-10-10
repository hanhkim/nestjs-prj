import { MysqlBaseService } from 'src/common/mysql/base.service';
import { ExpenseEntity } from './expense.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ExpenseDto } from './expense.dto';
import { plainToInstance } from 'class-transformer';

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
}
