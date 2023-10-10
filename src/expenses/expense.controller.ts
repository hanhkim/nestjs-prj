import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseDto } from './expense.dto';

@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  createExpense(@Body() expense: ExpenseDto): Promise<ExpenseDto> {
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
}
