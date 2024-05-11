import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FileDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  filename: number;

  @ApiProperty()
  @Expose()
  mimetype: string;

  @ApiProperty()
  destination: string;

  @ApiProperty()
  @Expose()
  path: Date;

  @ApiProperty()
  @Expose()
  size: string;
}
