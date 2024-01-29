import { Exclude, Expose } from 'class-transformer';

export class CategoryDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  parentId: number | null;

  @Expose()
  type: string | null;

  @Exclude()
  userId: string;
}
