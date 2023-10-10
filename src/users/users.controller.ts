import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Delete,
} from '@nestjs/common';
import { UserService } from './users.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() user: UserDto): Promise<UserDto> {
    return this.userService.save(user);
  }

  @Put(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() user: UserDto,
  ): Promise<string> {
    return this.userService.update(id, user);
  }

  @Get(':id')
  getUserById(@Param('id') id: string): Promise<UserDto> {
    return this.userService.findOne(id);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<any> {
    return this.userService.deleteById(id);
  }
}
