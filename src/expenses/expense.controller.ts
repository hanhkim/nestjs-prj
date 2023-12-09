import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from './expense.dto';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('transactions')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  createExpense(@Body() body: ExpenseDto, @Req() req): Promise<ExpenseDto> {
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
    return this.expenseService.findOne(id);
  }

  @Delete(':id')
  deleteExpenseById(@Param('id') id: string): Promise<any> {
    return this.expenseService.deleteById(id);
  }

  @Get()
  getTransactionList(): Promise<ExpenseDto> {
    return this.expenseService.getTransactionList();
  }
}
