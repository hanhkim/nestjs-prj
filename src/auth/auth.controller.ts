import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { Request } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';
import { AccountDto } from 'src/accounts/account.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description: 'Login into money note with email and password',
  })
  @Post('login')
  signin(@Body() data: AuthDto) {
    return this.authService.login(data.email, data.password);
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    this.authService.logout(req.user['sub'] as unknown as string);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return {
      ...req.user,
      defaultWallet: 'f5ec7b32-aefa-4aae-adf4-421fb6c74ff9',
    };
  }

  @Post('register')
  async registerUser(@Body() createAccountDto: AccountDto) {
    return await this.authService.register(createAccountDto);
  }
}
