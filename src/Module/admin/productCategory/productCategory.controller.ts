// category.controller.ts
import { Controller, Post,Delete,Param, Body, UseGuards, ValidationPipe, Request } from '@nestjs/common';
import { CategoryService } from './productCategory.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { AuthGuard } from '@nestjs/passport'; 
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';


@ApiTags('Product-Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({summary:'Add product Category'})
  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addCategory(@Body(new ValidationPipe()) createDto: CategoryCreateDto, @Request() req:any) {
    const admin = req.user;
    console.log(admin.role);// admin role
    await this.categoryService.addCategory(createDto,admin.role);
    return { message: 'Category added successfully.' };
  }

  @ApiOperation({summary:'delete Category'})
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('id') id: number, @Request() req:any) {
    const admin = req.user ;
    await this.categoryService.deleteCategory(id,admin.role);
    return { message: 'Category deleted successfully.' };
  }

}
