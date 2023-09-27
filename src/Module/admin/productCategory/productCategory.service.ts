import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { CategoryCreateDto } from './dto/category-create.dto';
import { CategoryUpdateDto } from './dto/category-update.dto';
import { categoryResponseMessage } from 'src/common/responses/category.response';




@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }




  async addCategory(createDto: CategoryCreateDto) {
    const { parentId, categoryName } = createDto;
    const categoryExist = await this.categoryRepository.findOne({ where: { id: parentId } })
    if (categoryExist)
      throw new NotFoundException(categoryResponseMessage.NOT_EXIST)
    const newCategory = this.categoryRepository.create({
      parentId,
      categoryName,
    });
    await this.categoryRepository.save(newCategory);
  }




  async deleteCategory(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(categoryResponseMessage.NOT_FOUND);
    await this.categoryRepository.remove(category);
  }




  async updateCategory(id: number, updateDto: CategoryUpdateDto) {
    const { parentId, categoryName } = updateDto;
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category)
      throw new NotFoundException(categoryResponseMessage.NOT_FOUND);
    if (parentId !== undefined)
      category.parentId = parentId;
    if (categoryName !== undefined)
      category.categoryName = categoryName;
    await this.categoryRepository.save(category);
  }




  async getAllCategories() {
    const categories = await this.categoryRepository.find();
    return categories;
  }
}
