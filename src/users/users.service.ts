import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './users.entity';
import { Repository } from 'typeorm';
import { UserDto } from './user.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async save(user: UserDto): Promise<UserDto> {
    const savedUser = await this.userRepository.save(user);

    return plainToInstance(UserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, user: UserDto): Promise<string> {
    const savedUser = await this.userRepository.update(id, user);

    if (!savedUser) return 'failed';

    return 'successful';
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOneBy({ id });

    return plainToInstance(UserDto, user, { excludeExtraneousValues: true });
  }

  async deleteById(id: string): Promise<{ result: string }> {
    const deletedUser = await this.userRepository.delete(id);

    console.log('deletedUser :>> ', deletedUser);

    if (!deletedUser) return { result: 'Delete failed!' };

    return { result: 'Delete successful!' };
  }
}
