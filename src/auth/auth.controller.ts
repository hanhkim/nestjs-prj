import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { Public } from './constants';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { AccountDto } from 'src/accounts/account.dto';
import { AccountService } from 'src/accounts/account.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() signInDto: Record<string, any>) {
    return this.authService.login(signInDto.email, signInDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }

  @Public()
  @Post('register')
  async registerUser(@Body() createAccountDto: AccountDto) {
    return await this.accountService.save(createAccountDto);
  }

  @Post('logout')
  logout(@Body() body: any) {
    return true;
  }
}
