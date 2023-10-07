import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from './account.entity';
import { Repository } from 'typeorm';
import { AccountDto } from './account.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
  ) {}

  async save(user: AccountDto): Promise<AccountDto> {
    const savedUser = await this.accountRepository.save(user);

    return plainToInstance(AccountDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, user: AccountDto): Promise<string> {
    const savedUser = await this.accountRepository.update(id, user);

    if (!savedUser) return 'failed';

    return 'successful';
  }

  async findOne(id: string): Promise<AccountDto> {
    console.log('fineOne :>> ', id);
    const user = await this.accountRepository.findOneBy({ id });

    return plainToInstance(AccountDto, user, { excludeExtraneousValues: true });
  }

  async deleteById(id: string): Promise<{ result: string }> {
    const deletedUser = await this.accountRepository.delete(id);

    console.log('deletedUser :>> ', deletedUser);

    if (!deletedUser) return { result: 'Delete failed!' };

    return { result: 'Delete successful!' };
  }
}
