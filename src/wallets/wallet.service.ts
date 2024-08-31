import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { Repository } from 'typeorm';
import { CreateWalletDto, WalletDto } from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { MysqlBaseService } from 'src/common/mysql/base.service';
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

  async save(wallet: CreateWalletDto): Promise<WalletDto> {
    const savedWallet = await this.walletRepository.save({
      ...wallet,
      setting: wallet?.setting ? flattenData(wallet.setting) : null,
    });
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

    return list;
  }

  async getWalletByIsDefault(userId: string): Promise<any> {
    const existingDefaultWallet = await this.walletRepository.findOneBy({
      userId: userId,
      isDefault: true,
    });

    return existingDefaultWallet;
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

    let amount = 0;

    if (category.type === ETransactionType.BORROWED_LENT) {
    } else if (category.type === ETransactionType.EARNED) {
      amount = Number(wallet.amount) + Number(transactionAmount);
    } else {
      amount = Number(wallet.amount) - Number(transactionAmount);
    }

    wallet.amount = amount;
    await this.walletRepository.save(wallet);

    return amount;
  }

  async setDefaultWallet(userId: string, walletId: string): Promise<string> {
    const foundDefaultWallet = await this.walletRepository.findOneBy({
      userId: userId,
      isDefault: true,
    });

    if (foundDefaultWallet) {
      await this.walletRepository.update(foundDefaultWallet.id, {
        ...foundDefaultWallet,
        isDefault: false,
      });
    }

    await this.walletRepository.update(walletId, {
      isDefault: true,
    });

    return 'success';
  }

  async getWalletOverview(walletId: string): Promise<any> {
    const wallet = await this.walletRepository.findOneBy({
      id: walletId,
    });

    return wallet;
  }
}

export function flattenData(data) {
  return JSON.stringify(data);
  // return {
  //   dataA: data.dataA,
  //   dataB: data.nestedData.dataB,
  //   dataC: data.nestedData.dataC,
  //   dataD: data.dataD,
  // };
}
