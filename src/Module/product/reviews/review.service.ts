import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entity/review.entity";
import { Order } from "src/Module/orders/entity/order.entity";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";
import { Product } from "../entity/product.entity";
import { ProductService } from "../product.service";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) { }




    async hasUserOrderedProduct(userId: number, productd: number): Promise<boolean> {
        const order = await this.orderRepository.findOne({
            where: { userId: userId, productId: productd }
        });
        return !!order;
    }



    
    async leaveReview(userId: number, productId: number, rating: number, comment: string) {
        const hasOrdered = await this.hasUserOrderedProduct(userId, productId)
        if (!hasOrdered) {
            throw new NotFoundException('You can only leave a review for products you have ordered')
        }
        const reviewExist = await this.reviewRepository.findOne({ where: { userId: userId, productId: productId } })
        if (reviewExist) {
            return { message: 'you have already reviewed the product ' }
        }
        const review = new Review();
        review.userId = userId;
        review.productId = productId;
        review.rating = rating;
        review.comment = comment;
        await this.reviewRepository.save(review);

        const product = await this.productRepository.findOne({ where: { productid: productId } })
        if (!product) {
            throw new NotFoundException('Product Not Found')
        }
        const reviews = await this.reviewRepository.find({ where: { productId } })
        const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRatings / reviews.length;
        product.Rating = averageRating;
        product.totalReview = reviews.length;
        await this.productRepository.save(product);

        return { message: 'Review submitted successfully.' };
    }

    async updateReview(userId: number, productId: number, updateReviewDto: CreateReviewDto) {
        const review = await this.reviewRepository.findOne({ where: { productId: productId, userId: userId } });
        console.log(review)
        if (!review) {
            throw new NotFoundException('Review not found.');
        }

        review.rating = updateReviewDto.rating;
        review.comment = updateReviewDto.comment;
        await this.reviewRepository.save(review);
        // await this.updateProductAverageRating(productId)
        return { message: 'Review updated successfully.' };
    }




    async getProductReviews(productd: number) {
        const reviews = await this.reviewRepository.find({ where: { productId: productd } });
        return reviews;
    }




    async getReviewsByUser(userId: number) {
        console.log('---------', userId)
        const reviews = await this.reviewRepository.find({
            where: { userId }
        });

        if (!reviews || reviews.length === 0) {
            throw new NotFoundException('No reviews found for the user.');
        }
        return reviews;
    }




    async deleteReview(userId: number, reviewId: number) {
        const review = await this.reviewRepository.findOne({
            where: { id: reviewId, userId }, // Ensure that the review belongs to the user
        });
        if (!review) {
            return null; // Return null if the review is not found
        }
        await this.reviewRepository.remove(review);
        return review;
    }

    //   async updateProductAverageRating(productId: number): Promise<void> {
    //     const product = await this.productRepository.findOne({
    //       where: { productid: productId }, // Use the correct column name for your primary key
    //       relations: ['reviews'],
    //     });

    //     if (!product) {
    //       throw new NotFoundException('Product not found');
    //     }

    //     const totalRatings = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    //     const averageRating = totalRatings / product.reviews.length;

    //     product.Rating = averageRating;

    //     await this.productRepository.save(product);
    //   }


}
