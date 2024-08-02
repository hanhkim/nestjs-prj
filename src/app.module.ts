import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AccountEntity } from './accounts/account.entity';
import { AccountModule } from './accounts/account.module';
import { CategoryModule } from './categories/category.module';
import { CategoryEntity } from './categories/category.entity';
import { ExpenseEntity } from './expenses/expense.entity';
import { WalletEntity } from './wallets/wallet.entity';
import { ExpenseModule } from './expenses/expense.module';
import { WalletModule } from './wallets/wallet.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { FileModule } from './file/file.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { diskStorage } from 'multer';
import { AssetEntity } from './file/file.entity';
import { ConfigModule } from '@nestjs/config';
import { dbConfigurations } from './constants/dbConfig.constants';

export const multerConfig = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      console.log('multerConfig hello :>> ');
      cb(null, '././public/files'); // specify the destination folder
    },
    filename: (req, file, cb) => {
      console.log('multerConfig file ne :>> ', file);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
  }),
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: dbConfigurations.ORM_HOST,
      port: dbConfigurations.ORM_PORT as unknown as number,
      username: dbConfigurations.ORM_USERNAME,
      password: dbConfigurations.ORM_PASSWORD,
      database: dbConfigurations.ORM_DB,
      entities: [
        AccountEntity,
        CategoryEntity,
        ExpenseEntity,
        WalletEntity,
        AssetEntity,
      ],
      logging: 'all',
      synchronize: dbConfigurations.ORM_SYNCHRONIZE as unknown as boolean, // khi nao len product thi off nay vi no tu dong sync vao databas
    }),
    AccountModule,
    CategoryModule,
    ExpenseModule,
    WalletModule,
    AuthModule,
    MulterModule.register(multerConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
    }),
    FileModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
