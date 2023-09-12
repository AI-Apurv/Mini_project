import { Controller, Post,Delete,Param, Body, UseGuards, ValidationPipe, Request, Put, Get } from '@nestjs/common';
import { CategoryService } from './productCategory.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { categoryResponseMessage } from 'src/common/responses/category.response';

@ApiTags('Product-Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return { categories };
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'Add product Category'})
  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addCategory(@Body(new ValidationPipe()) createDto: CategoryCreateDto, @Request() req:any) {
    const admin = req.user;
    console.log(admin.role);
    await this.categoryService.addCategory(createDto,admin.role);
    return { message: categoryResponseMessage.SUCCESS };
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'delete Category'})
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id') id: number, @Request() req:any) {
    const admin = req.user ;
    await this.categoryService.deleteCategory(id,admin.role);
    return { message: categoryResponseMessage.DELETE };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the Category' })
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateCategory(
  @Param('id') id: number,
  @Body(new ValidationPipe()) updateDto: CategoryUpdateDto,
  @Request() req: any,
) {
  const admin = req.user;
  await this.categoryService.updateCategory(id, updateDto, admin.role);
  return { message: categoryResponseMessage.UPDATE };
}

}
