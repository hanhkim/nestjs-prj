import { Expose, Transform } from 'class-transformer';

enum EGender {
  MALE = 'male',
  FEMALE = 'female',
}

enum EStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETE = 'delete',
}

export class AccountDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  gender: EGender;

  @Expose()
  address: string;

  @Expose()
  password: string;

  @Expose()
  status: EStatus;
}

export class LoginDto {
  email: string;
  password: string;
}
