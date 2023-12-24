import { Expose } from 'class-transformer';

export class ExpenseDto {
  @Expose()
  id: string;

  @Expose()
  amount: number;

  @Expose()
  categoryId: number;

  // enum: Expense / Earning/ Borrowed-Lent
  @Expose()
  type: string;

  @Expose()
  note: string;

  @Expose()
  date: Date;

  @Expose()
  toWhom: string;

  @Expose()
  img: string;

  // @Expose()
  userId: string; // note: don't remember what meaning of this field => who add

  @Expose()
  walletId: string;
}
