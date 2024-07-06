import { Exclude } from 'class-transformer';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export type Nullable<T> = T | null;

@Entity({
  name: 'account',
})
export class AccountEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  email: string;

  @Column()
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({
    type: 'enum',
    enum: ['male', 'female'],
  })
  gender: string;

  @Column({ type: 'varchar', nullable: true })
  address: Nullable<string>;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'delete'],
    default: 'active',
  })
  status: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  refreshToken?: string;
}
