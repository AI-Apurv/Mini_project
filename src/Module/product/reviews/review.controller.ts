import { Controller,Get, Post,Put ,UseGuards,Request,Param,Body } from "@nestjs/common";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";


@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService){}

    @Get('products/:productId')
    async getProductReviews(@Param('productId') productId: number){
        return this.reviewService.getProductReviews(productId);
    }

    @Post(':productId')
    @UseGuards(JwtAuthGuard)
    async leaveReview(
        @Request() req: any,
        @Param('productId') productId: number,
        @Body() createReviewDto: CreateReviewDto, 
    ) {
        const userId = req.user.userId;
        return this.reviewService.leaveReview(userId, productId, createReviewDto.rating, createReviewDto.comment);
    }


    @Put(':productId')
    @UseGuards(JwtAuthGuard)
    async updateReview(
        @Request() req: any,
        @Param('productId') productId: number,
        @Body() updateReviewDto: CreateReviewDto,
    ) {
        const userId = req.user.userId;
        console.log('userId----------------',userId)
        return this.reviewService.updateReview(userId, productId, updateReviewDto);
    }
}
