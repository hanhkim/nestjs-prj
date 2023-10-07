import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { UserEntity } from './users/users.entity';
import { AccountEntity } from './accounts/account.entity';
import { AccountModule } from './accounts/account.module';
import { CategoryModule } from './categoris/category.module';
import { CategoryEntity } from './categoris/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'kimhanh134',
      database: 'hali_community',
      entities: [UserEntity, AccountEntity, CategoryEntity],
      synchronize: true, // khi nao len product thi off nay vi no tu dong sync vao databas
    }),
    UserModule,
    AccountModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
