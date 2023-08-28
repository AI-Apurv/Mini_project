// Review.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/Module/users/entity/user.entity'; 
import { Product } from '../../entity/product.entity';

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @Column()
    userId: number;

    @Column()
    productId: number;
}
