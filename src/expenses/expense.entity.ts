import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'expense',
})
export class ExpenseEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  amount: number;

  @Column()
  categoryId: number;

  @Column()
  type: number;

  @Column()
  note: string;

  @Column()
  date: Date;

  @Column()
  toWhom: string;

  @Column()
  img: string;

  @Column()
  userId: string;

  @Column()
  walletId: string;
}
