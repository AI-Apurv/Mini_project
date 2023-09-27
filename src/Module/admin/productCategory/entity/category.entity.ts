import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Category')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    parentId: number | null;

    @Column()
    categoryName: string;

}
