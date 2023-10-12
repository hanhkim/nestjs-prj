import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountDto } from './account.dto';
import { Public } from 'src/auth/constants';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  createUser(@Body() user: AccountDto): Promise<AccountDto> {
    return this.accountService.save(user);
  }

  @Public()
  @Put(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() user: AccountDto,
  ): Promise<string> {
    return this.accountService.update(id, user);
  }

  @Public()
  @Get(':id')
  getUserById(@Param('id') id: string): Promise<AccountDto> {
    return this.accountService.findOne(id);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<any> {
    return this.accountService.deleteById(id);
  }
}
