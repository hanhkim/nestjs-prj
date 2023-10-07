import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './category.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly accountRepository: Repository<CategoryEntity>,
  ) {}

  async save(user: CategoryDto): Promise<CategoryDto> {
    const savedUser = await this.accountRepository.save(user);

    return plainToInstance(CategoryDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, user: CategoryDto): Promise<string> {
    const savedUser = await this.accountRepository.update(id, user);

    if (!savedUser) return 'failed';

    return 'successful';
  }

  async findOne(id: number): Promise<CategoryDto> {
    console.log('fineOne :>> ', id);
    const user = await this.accountRepository.findOneBy({ id });

    return plainToInstance(CategoryDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async deleteById(id: string): Promise<{ result: string }> {
    const deletedUser = await this.accountRepository.delete(id);

    if (!deletedUser) return { result: 'Delete failed!' };

    return { result: 'Delete successful!' };
  }
}
