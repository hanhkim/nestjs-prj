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

  email: string;

  phone: string;

  firstName: string;

  lastName: string;

  gender: EGender;

  address: string;

  password: string;

  status: EStatus;
}
