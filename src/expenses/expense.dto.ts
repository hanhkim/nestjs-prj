import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExpenseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  amount: number;

  @ApiProperty()
  @Expose()
  categoryId: number;

  // enum: Expense / Earning/ Borrowed-Lent
  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  note: string;

  @ApiProperty()
  @Expose()
  date: Date;

  @ApiProperty()
  @Expose()
  toWhom: string;

  @ApiProperty()
  @Expose()
  img: string;

  @ApiProperty()
  // @Expose()
  userId: string; // note: don't remember what meaning of this field => who add

  @ApiProperty()
  @Expose()
  walletId: string;
}
