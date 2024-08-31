import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'wallet',
})
export class WalletEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  name: string;

  @Column()
  amount: number;

  @Column({
    nullable: true,
  })
  description: string;

  @Column()
  userId: string;

  @Column({
    nullable: true,
  })
  imgUrl: string;

  @Column({
    default: 'VND',
  })
  currencyUnit: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  isDefault: boolean;

  @Column({
    type: 'json',
    nullable: true,
  })
  setting: string;

  @Column({
    default: 0,
  })
  totalIncome: number;

  @Column({
    default: 0,
  })
  totalExpense: number;

  @Column({ default: 0 })
  transferAmount: number;

  @Column({ default: 0 })
  receiveAmount: number;
}
