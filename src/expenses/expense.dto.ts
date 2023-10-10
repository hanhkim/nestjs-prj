import { Expose } from 'class-transformer';

export class ExpenseDto {
  @Expose()
  id: string;

  @Expose()
  amount: number;

  @Expose()
  categoryId: number;

  @Expose()
  type: number;

  @Expose()
  note: string;

  @Expose()
  date: Date;

  @Expose()
  toWhom: string;

  @Expose()
  img: string;

  @Expose()
  userId: string; // note: don't remember what meaning of this field

  @Expose()
  walletId: string;
}
