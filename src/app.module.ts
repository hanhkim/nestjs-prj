import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountEntity } from './accounts/account.entity';
import { AccountModule } from './accounts/account.module';
import { CategoryModule } from './categories/category.module';
import { CategoryEntity } from './categories/category.entity';
import { ExpenseEntity } from './expenses/expense.entity';
import { WalletEntity } from './wallets/wallet.entity';
import { ExpenseModule } from './expenses/expense.module';
import { WalletModule } from './wallets/wallet.module';
// import { AuthModule } from './auth1/auth.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'kimhanh134',
      database: 'hali_community',
      entities: [AccountEntity, CategoryEntity, ExpenseEntity, WalletEntity],
      logging: 'all',
      synchronize: true, // khi nao len product thi off nay vi no tu dong sync vao databas
    }),
    AccountModule,
    CategoryModule,
    ExpenseModule,
    WalletModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
