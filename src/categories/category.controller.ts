import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Get,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './category.dto';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';

@UseGuards(AccessTokenGuard)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // @Get()
  // getAllCategories(): Promise<any> {
  //   console.log('hello :>> ');
  //   return this.categoryService.getAllCategories();
  // }

  @Get()
  getCategoriesByType(@Req() req): Promise<CategoryDto[]> {
    const { type } = req.query;
    console.log('type :>> ', type);
    return this.categoryService.getCategoriesByType(type);
  }

  @Post()
  createCategory(@Body() category: CategoryDto): Promise<CategoryDto> {
    return this.categoryService.save(category);
  }

  @Put(':id')
  updateUserById(
    @Param('id') id: string,
    @Body() category: CategoryDto,
  ): Promise<string> {
    return this.categoryService.update(id, category);
  }

  @Get(':id')
  getUserById(@Param('id') id: number): Promise<CategoryDto> {
    return this.categoryService.findOne(id);
  }

  @Delete(':id')
  deleteUserById(@Param('id') id: string): Promise<any> {
    return this.categoryService.deleteById(id);
  }
}
