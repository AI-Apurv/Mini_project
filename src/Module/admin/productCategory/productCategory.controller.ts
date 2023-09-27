import { Controller, Post, Delete, Param, Res, Body, UseGuards, ValidationPipe, Request, Put, Get } from '@nestjs/common';
import { CategoryService } from './productCategory.service';
import { CategoryCreateDto } from './dto/category-create.dto';
import { JwtAdminAuthGuard, JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { CATEGORYRESPONSE, categoryResponseMessage } from 'src/common/responses/category.response';
import { httpResponse } from 'src/Middleware/httpResponse';
import { Response } from 'express';


@ApiTags('Product-Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService, private readonly httpResponse: httpResponse) { }




  /**
* @author Apurv
* @description This function will used for getting all categories list
*/
  @ApiOperation({ summary: 'Get all categories' })
  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();
    return { categories };
  }




  /**
* @author Apurv
* @description This function will used for adding categories
* @Body CategoryCreateDto
* @payload parentId , categoryName
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add product Category' })
  @Post('add')
  @UseGuards(JwtAdminAuthGuard)
  async addCategory(@Body(new ValidationPipe()) createDto: CategoryCreateDto, @Request() req: any, @Res() response: Response) {
    const admin = req.user;
    await this.categoryService.addCategory(createDto);
    return this.httpResponse.sendResponse(response, CATEGORYRESPONSE.SUCCESS)
  }




  /**
* @author Apurv
* @description This function will used for deleting category
* @Param id
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'delete Category' })
  @Delete(':id')
  @UseGuards(JwtAdminAuthGuard)
  async deleteCategory(@Param('id') id: number, @Request() req: any, @Res() response: Response) {
    const admin = req.user;
    await this.categoryService.deleteCategory(id);
    return this.httpResponse.sendResponse(response, CATEGORYRESPONSE.DELETE)
  }






  /**
* @author Apurv
* @description This function will used for updating category
* @Body CategoryUpdateDto
* @Param id
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the Category' })
  @Put(':id')
  @UseGuards(JwtAdminAuthGuard)
  async updateCategory(@Param('id') id: number, @Body(new ValidationPipe()) updateDto: CategoryUpdateDto, @Request() req: any, @Res() response: Response) {
    const admin = req.user;
    await this.categoryService.updateCategory(id, updateDto);
    return this.httpResponse.sendResponse(response, CATEGORYRESPONSE.UPDATE)
  }




}
