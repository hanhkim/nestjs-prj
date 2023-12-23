// reference to: https://blog.bitsrc.io/upload-file-with-nestjs-d7dd74701b38

import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
