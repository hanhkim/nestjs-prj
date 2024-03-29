import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { Repository } from 'typeorm';
import { WalletDto } from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { CategoryDto } from 'src/categories/category.dto';
import { ETransactionType } from 'src/enums/common';
import { CategoryService } from 'src/categories/category.service';

@Injectable()
export class WalletService extends MysqlBaseService<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly categoryService: CategoryService,
  ) {
    super(walletRepository);
  }

  async save(wallet: WalletDto): Promise<WalletDto> {
    const savedWallet = await this.walletRepository.save(wallet);

    return plainToInstance(WalletDto, savedWallet, {
      excludeExtraneousValues: true,
    });
  }

  async getWalletList(userId: string): Promise<any> {
    const list = await this.walletRepository
      .createQueryBuilder('wallet')
      .where('wallet.userId=:userId', {
        userId: userId,
      })
      .getMany();

    console.log('list :>> ', list);
    return list;
  }

  async calculateWalletBalance(
    walletId: string,
    categoryId: number,
    transactionAmount: number,
  ): Promise<number> {
    const wallet = await this.walletRepository.findOneBy({
      id: walletId as any,
    });

    const category = await this.categoryService.findOne(categoryId); // todo: update category id to string

    console.log('category hanh:>> ', category, transactionAmount);
    let amount = 0;

    if (category.type === ETransactionType.BORROWED_LENT) {
    } else if (category.type === ETransactionType.EARNED) {
      amount = Number(wallet.amount) + Number(transactionAmount);
    } else {
      amount = Number(wallet.amount) - Number(transactionAmount);
    }
    console.log('amount ne:>> ', wallet, amount);

    wallet.amount = amount;
    await this.walletRepository.save(wallet);

    return amount;
  }
}
