import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export interface WalletSetting {
  textColor: string;
  backgroundColor: string;
}

export class CreateWalletDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  imgUrl?: string;

  @ApiProperty()
  @Expose()
  isDefault: boolean;

  @ApiProperty()
  @Expose()
  setting: WalletSetting;
}

export class GeneralWalletDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  totalIncome: number;

  @ApiProperty()
  @Expose()
  totalExpense: number;

  @ApiProperty()
  @Expose()
  totalBalance: number; // should use this name instead of amount

  @ApiProperty()
  @Expose()
  transferAmount?: number;

  @ApiProperty()
  @Expose()
  receiveAmount: number;

  // @ApiProperty()
  // @Expose()
  // amountFromMonth: number;

  // @ApiProperty()
  // @Expose()
  // amountEndMonth: number;
}

export class WalletDto extends GeneralWalletDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  amount: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  imgUrl?: string;

  @ApiProperty()
  @Expose()
  isDefault: boolean;

  @ApiProperty()
  @Expose()
  setting: WalletSetting;
}

export class WalletTransferMoneyDto {
  fromWalletId: string | null;
  toWalletId: string | null;
  amount: number;
  note?: string;
  date: Date | string;
}
