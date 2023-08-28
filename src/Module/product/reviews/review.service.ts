import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Review } from "./entity/review.entity";
import { Order } from "src/Module/orders/entity/order.entity";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./dto/create-review.dto";

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>
    ) {}

    async leaveReview(userId: number, productId: number, rating: number, comment: string) {
        const order = await this.orderRepository.findOne({ where: { userId, productId } });

       
        if (!order) {
            throw new NotFoundException('product not found');
        }


        const review = new Review();
        review.userId = userId;
        review.productId = productId;
        review.rating = rating;
        review.comment = comment;

        await this.reviewRepository.save(review);

        return { message: 'Review submitted successfully.' };
    }

    async updateReview(userId: number, productId: number, updateReviewDto: CreateReviewDto) {
        const review = await this.reviewRepository.findOne({where:{productId:productId , userId:userId} });
        console.log(review)
        if (!review) {
            throw new NotFoundException('Review not found.');
        }

        review.rating = updateReviewDto.rating;
        review.comment = updateReviewDto.comment;
        await this.reviewRepository.save(review);

        return { message: 'Review updated successfully.'};

    }

    async getProductReviews(productd: number)
    {
        const reviews = await this.reviewRepository.find({where:{productId: productd}});
        return reviews;
    }


 
   
}
