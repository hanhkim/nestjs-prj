import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto, WalletDto } from './wallet.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { plainToInstance } from 'class-transformer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wallet')
@UseGuards(AccessTokenGuard)
@Controller('wallets')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  createWallet(
    @Body() wallet: CreateWalletDto,
    @Req() req,
  ): Promise<WalletDto> {
    const userId = req.user['sub'];
    const walletData = {
      ...wallet,
      userId,
    };
    return this.walletService.save({
      ...walletData,
      // setting: flattenData(walletData?.setting) || null,
    });
  }

  @Put(':id')
  async updateWalletById(
    @Param('id') id: string,
    @Body() wallet: WalletDto,
    @Req() req,
  ): Promise<string> {
    const userId = req.user['sub'];
    const { isDefault } = wallet;
    if (isDefault) {
      const foundDefaultWallet = await this.walletService.getWalletByIsDefault(
        userId,
      );
      if (foundDefaultWallet.id !== wallet.id) {
        await this.walletService.update(foundDefaultWallet.id, {
          ...foundDefaultWallet,
          isDefault: false,
        });
      }
    }
    return this.walletService.update(id, wallet);
  }

  @Get(':id')
  async getWalletById(@Param('id') id: string): Promise<WalletDto> {
    const result = await this.walletService.findOne(id);
    return plainToInstance(WalletDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  deleteWalletById(@Param('id') id: string): Promise<any> {
    return this.walletService.deleteById(id);
  }

  @Get()
  getWalletList(@Req() req): Promise<WalletDto> {
    const userId = req.user['sub'];
    return this.walletService.getWalletList(userId);
  }

  @Post('set-default/:id')
  setDefaultWallet(@Param('id') id: string, @Req() req): Promise<string> {
    const userId = req.user['sub'];
    return this.walletService.setDefaultWallet(userId, id);
  }
}
