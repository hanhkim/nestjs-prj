import { BaseEntity } from 'src/common/mysql/base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'asset',
})
export class AssetEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fieldname: string; // field when upload by api

  @Column()
  originalname: string;

  @Column()
  encoding: string;

  @Column()
  mimetype: string;

  @Column()
  destination: string; // folder to set

  @Column()
  filename: string; // unique name: fieldname-{datetime}-{originalName}-{extensionFile}

  @Column()
  path: string; // path to get file

  @Column()
  size: number; // unit: byte
}
