import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 50,
  })
  firstname: string;

  @Column()
  lastname: string;

  @Column({
    default: false,
  })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: ['admin', 'staff'],
    default: 'admin',
  })
  role: string;
}
