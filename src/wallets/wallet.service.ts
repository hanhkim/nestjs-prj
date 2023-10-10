import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { Repository } from 'typeorm';
import { WalletDto } from './wallet.dto';
import { plainToInstance } from 'class-transformer';
import { MysqlBaseService } from 'src/common/mysql/base.service';

@Injectable()
export class WalletService extends MysqlBaseService<WalletEntity> {
  constructor(
    @InjectRepository(WalletEntity)
    private readonly walletRepository: Repository<WalletEntity>,
  ) {
    super(walletRepository);
  }

  async save(wallet: WalletDto): Promise<WalletDto> {
    const savedWallet = await this.walletRepository.save(wallet);

    return plainToInstance(WalletDto, savedWallet, {
      excludeExtraneousValues: true,
    });
  }
}
