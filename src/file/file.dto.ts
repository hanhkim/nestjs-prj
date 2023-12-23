import { Expose } from 'class-transformer';

export class FileDto {
  @Expose()
  id: string;

  @Expose()
  filename: number;

  @Expose()
  mimetype: string;

  destination: string;

  @Expose()
  path: Date;

  @Expose()
  size: string;
}
