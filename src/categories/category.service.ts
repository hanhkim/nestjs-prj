import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './category.entity';
import { Repository } from 'typeorm';
import { CategoryDto } from './category.dto';
import { plainToInstance } from 'class-transformer';
import { ETransactionType } from 'src/enums/common';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async save(category: CategoryDto): Promise<CategoryDto> {
    const savedCategory = await this.categoryRepository.save(category);

    return plainToInstance(CategoryDto, savedCategory, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, category: CategoryDto): Promise<string> {
    const savedCategory = await this.categoryRepository.update(id, category);

    if (!savedCategory) return 'failed';

    return 'successful';
  }

  async findOne(id: number): Promise<CategoryDto> {
    const category = await this.categoryRepository.findOneBy({ id });

    return plainToInstance(CategoryDto, category, {
      excludeExtraneousValues: true,
    });
  }

  async deleteById(id: string): Promise<{ result: string }> {
    const deletedCategory = await this.categoryRepository.delete(id);

    if (!deletedCategory) return { result: 'Delete failed!' };

    return { result: 'Delete successful!' };
  }

  async getAllCategories(): Promise<any> {
    const list = await this.categoryRepository.find();
    return list;
  }

  async getCategoriesByType(type: ETransactionType): Promise<CategoryDto[]> {
    const list = await this.categoryRepository
      .createQueryBuilder('category')
      .where({
        type: type,
      })
      .getMany();
    return list;
  }
}
