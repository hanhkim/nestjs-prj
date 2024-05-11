import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseDto<T> {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  createdDate: string;

  @ApiProperty()
  @Expose()
  updatedDate: boolean;
}
