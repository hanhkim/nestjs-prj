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
    const user = await this.accountRepository.findOneBy({ id });

    return plainToInstance(AccountDto, user, { excludeExtraneousValues: true });
  }

  async deleteById(id: string): Promise<{ result: string }> {
    const deletedUser = await this.accountRepository.delete(id);

    if (!deletedUser) return { result: 'Delete failed!' };

    return { result: 'Delete successful!' };
  }

  async getUserByEmail(email: string): Promise<any> {
    const user = await this.accountRepository.findOneBy({
      email: email,
    });

    return user;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    await this.accountRepository.update(userId, {
      refreshToken: refreshToken,
    });
  }
}
