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

  @Column({
    type: 'enum',
    enum: ['expensed', 'earned', 'borrowed_lent'],
    default: 'expensed',
  })
  type: string;

  @Column({ nullable: true })
  note: string;

  @Column()
  date: Date;

  @Column({ nullable: true })
  toWhom: string;

  @Column({ nullable: true })
  img: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  walletId: string;
}
