import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  parentId: number | null;

  @ApiProperty()
  @Expose()
  type: string | null;

  @ApiProperty()
  @Exclude()
  userId: string;
}
