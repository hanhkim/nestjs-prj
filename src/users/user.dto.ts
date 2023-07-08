import { Expose, Transform } from 'class-transformer';

export class UserDto {
  @Expose()
  id: string;

  firstname: string;

  lastname: string;

  @Transform(({ obj }) => `${obj.firstname} ${obj.lastname}`)
  @Expose()
  fullname: string;

  @Expose()
  isActive: boolean;
}
