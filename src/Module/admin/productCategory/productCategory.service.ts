// category.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { CategoryCreateDto } from './dto/category-create.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async addCategory(createDto: CategoryCreateDto, userRole: string) {
    if(userRole!== 'admin')
    {
        throw new NotFoundException('You are not authorized to perform this action.');
    }

    
    const { parentId,categoryName } = createDto;
    const newCategory = this.categoryRepository.create({
      parentId,
      categoryName,
    });
    console.log(newCategory)
    await this.categoryRepository.save(newCategory);
  }

  async deleteCategory(id: number, userRole: string) {
    if (userRole !== 'admin') {
      throw new NotFoundException('You are not authorized to perform this action.');
    }

    const category = await this.categoryRepository.findOne({where:{id}});
    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    await this.categoryRepository.remove(category);
  }
}
