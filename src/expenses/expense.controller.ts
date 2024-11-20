import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from './expense.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { AssetEntity } from 'src/file/file.entity';
import { diskStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('transactions')
@UseGuards(AccessTokenGuard)
@Controller('transactions')
export class ExpenseController {
  constructor(
    private readonly expenseService: ExpenseService,
    private readonly assetService: FileService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './public/assets'); // specify the destination folder
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now();
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + '-' + file.originalname,
          );
        },
      }),
    }),
  )
  async createExpense(
    @UploadedFile() img: Express.Multer.File,
    @Body() body: ExpenseDto,
    @Req() req,
  ): Promise<ExpenseDto> {
    let result;
    if (img) {
      result = await this.assetService.save(img as unknown as AssetEntity);
    }

    const userId = req.user['sub'];
    const expense = {
      ...body,
      userId,
      img: result?.id,
    };

    return this.expenseService.save(expense);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('img', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          cb(null, './public/assets'); // specify the destination folder
        },
        filename: (req, file, cb) => {
          console.log('file :>> ', file);
          const uniqueSuffix = Date.now();
          cb(
            null,
            file.fieldname + '-' + uniqueSuffix + '-' + file.originalname,
          );
        },
      }),
    }),
  )
  updateExpenseById(
    @Param('id') id: string,
    @Body() expense: any,
    @Req() req,
  ): Promise<any> {
    return this.expenseService.update(id, expense);
  }

  @Get(':id')
  async getExpenseById(@Param('id') id: string): Promise<ExpenseDto> {
    const result = await this.expenseService.findOne(id);

    return {
      ...result,
      img: result.img ? this.assetService.getFullUrl(result.img) : null,
    };
  }

  @Delete(':id')
  deleteExpenseById(@Param('id') id: string): Promise<any> {
    return this.expenseService.deleteById(id);
  }

  @Get()
  getTransactionList(@Req() request: Request): Promise<ExpenseDto> {
    const userId = request.user['sub'];
    const { month, walletId } = request.query;
    return this.expenseService.getTransactionList(
      userId,
      month as unknown as string,
      walletId as string,
    );
  }
}
