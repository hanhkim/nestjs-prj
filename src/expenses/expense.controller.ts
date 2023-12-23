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

@UseGuards(AccessTokenGuard)
@Controller('transactions')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createExpense(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: ExpenseDto,
    @Req() req,
  ): Promise<ExpenseDto> {
    console.log('file :>> ', file);
    const userId = req.user['sub'];
    const expense = { ...body, userId };
    return this.expenseService.save(expense);
  }

  @Put(':id')
  updateExpenseById(
    @Param('id') id: string,
    @Body() expense: ExpenseDto,
  ): Promise<string> {
    return this.expenseService.update(id, expense);
  }

  @Get(':id')
  getExpenseById(@Param('id') id: string): Promise<ExpenseDto> {
    console.log('id :>> ', id);
    return this.expenseService.findOne(id);
  }

  @Delete(':id')
  deleteExpenseById(@Param('id') id: string): Promise<any> {
    return this.expenseService.deleteById(id);
  }

  @Get()
  getTransactionList(@Req() request: Request): Promise<ExpenseDto> {
    const { month } = request.query;
    return this.expenseService.getTransactionList(month);
  }
}
