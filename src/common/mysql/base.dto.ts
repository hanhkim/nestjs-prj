import { Expose } from 'class-transformer';

export class BaseDto<T> {
  @Expose()
  id: string;

  @Expose()
  createdDate: string;

  @Expose()
  updatedDate: boolean;
}
