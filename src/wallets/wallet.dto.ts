import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class WalletDto {
  @ApiProperty()
  @Expose()
  id: string;

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
}
