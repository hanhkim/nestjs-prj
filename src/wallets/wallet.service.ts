import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateWalletDto,
  WalletDto,
  WalletTransferMoneyDto,
} from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { ETransactionType } from 'src/enums/common';
import { CategoryService } from 'src/categories/category.service';
import { ExpenseService } from 'src/expenses/expense.service';
import { ExpenseDto } from 'src/expenses/expense.dto';

@Injectable()
export class WalletService extends MysqlBaseService<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => ExpenseService))
    private readonly expenseService: ExpenseService,
  ) {
    super(walletRepository);
  }

  async save(wallet: CreateWalletDto): Promise<WalletDto> {
    const savedWallet = await this.walletRepository.save({
      ...wallet,
      amount: wallet.amount.toString(),
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
    let totalIncome = +wallet.totalIncome;
    let totalExpense = +wallet.totalExpense;

    if (category.type === ETransactionType.BORROWED_LENT) {
      switch (category.name) {
        // amount descrease
        case 'Cho vay':
        case 'Trả nợ':
          amount = Number(wallet.amount) - Number(transactionAmount);
          totalExpense = totalExpense + +transactionAmount;
          break;

        // amount increase
        case 'Đi vay':
        case 'Thu nợ':
          amount = Number(wallet.amount) + Number(transactionAmount);
          totalIncome = totalIncome + +transactionAmount;
          break;

        default:
          break;
      }
    } else if (category.type === ETransactionType.EARNED) {
      amount = Number(wallet.amount) + Number(transactionAmount);
      totalIncome = totalIncome + +transactionAmount;
    } else {
      amount = Number(wallet.amount) - Number(transactionAmount);
      totalExpense = totalExpense + +transactionAmount;
    }

    wallet.amount = amount.toString();
    wallet.totalExpense = totalExpense;
    wallet.totalIncome = totalIncome;

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

  async transferMoney(
    data: WalletTransferMoneyDto,
    userId: string,
  ): Promise<void> {
    const { fromWalletId, toWalletId, amount, date, note } = data;

    const fromWallet = await this.walletRepository.findOneBy({
      id: fromWalletId,
      deletedAt: null,
    });
    const toWallet = await this.walletRepository.findOneBy({
      id: toWalletId,
      deletedAt: null,
    });

    if (!fromWallet || !toWallet) {
      throw new BadRequestException('Wallet not found!');
    }

    fromWallet.amount = (+fromWallet.amount - +amount).toString();
    fromWallet.totalExpense = +fromWallet.totalExpense + +amount;
    fromWallet.transferAmount = +fromWallet.transferAmount + +amount;

    toWallet.amount = (+toWallet.amount + +amount).toString();
    toWallet.totalIncome = +toWallet.totalIncome + +amount;
    toWallet.receiveAmount = +toWallet.receiveAmount + +amount;

    const newExpenseWalletFrom: ExpenseDto = {
      id: uuidv4(),
      amount,
      categoryId: 59, // chuyen tien sang ví
      type: ETransactionType.EXPENSED,
      note: `Chuyển tiền đến ${toWallet.name}`,
      date: new Date(date),
      toWhom: toWallet.name,
      userId,
      walletId: fromWalletId,
      img: null,
    };

    const newExpenseWalletTo: ExpenseDto = {
      id: uuidv4(),
      amount,
      categoryId: 60,
      type: ETransactionType.EARNED,
      note: `Nhận tiền từ ${fromWallet.name}`,
      date: new Date(date),
      toWhom: '',
      userId,
      walletId: toWalletId,
      img: null,
    };

    this.expenseService.saveWithoutCalculateWallet(newExpenseWalletFrom);
    this.expenseService.saveWithoutCalculateWallet(newExpenseWalletTo);

    await Promise.all([
      this.walletRepository.save(fromWallet),
      this.walletRepository.save(toWallet),
    ]);
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
