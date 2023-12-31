import { Expose } from 'class-transformer';

export class WalletDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  amount: number;
}
