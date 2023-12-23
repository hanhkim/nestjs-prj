import { Injectable } from '@nestjs/common';
import { MysqlBaseService } from 'src/common/mysql/base.service';
import { AssetEntity } from './file.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FileDto } from './file.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FileService extends MysqlBaseService<AssetEntity> {
  constructor(
    @InjectRepository(AssetEntity)
    private readonly assetRepository: Repository<AssetEntity>,
  ) {
    super(assetRepository);
  }

  async save(expense: AssetEntity): Promise<FileDto> {
    const savedAsset = await this.assetRepository.save(expense);

    return plainToInstance(FileDto, savedAsset, {
      excludeExtraneousValues: true,
    });
  }
}
