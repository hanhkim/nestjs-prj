import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'category',
})
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
  })
  name: string;

  @Column({ nullable: true })
  parentId: number | null;

  @Column({
    type: 'enum',
    enum: ['expensed', 'earned', 'borrowed_lent'],
    default: 'expensed',
  })
  type: string | null;

  @Column({
    default: 'system',
    select: false,
  })
  userId: string;

  @Column()
  icon: string;
}
