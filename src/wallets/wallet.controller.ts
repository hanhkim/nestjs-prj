import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletDto } from './wallet.dto';

@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  createWallet(@Body() wallet: WalletDto): Promise<WalletDto> {
    return this.walletService.save(wallet);
  }

  @Put(':id')
  updateWalletById(
    @Param('id') id: string,
    @Body() wallet: WalletDto,
  ): Promise<string> {
    return this.walletService.update(id, wallet);
  }

  @Get(':id')
  getWalletById(@Param('id') id: string): Promise<WalletDto> {
    return this.walletService.findOne(id);
  }

  @Delete(':id')
  deleteWalletById(@Param('id') id: string): Promise<any> {
    return this.walletService.deleteById(id);
  }

  @Get()
  getWalletList(): Promise<WalletDto> {
    return this.walletService.getWalletList();
  }
}
