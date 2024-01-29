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
}
