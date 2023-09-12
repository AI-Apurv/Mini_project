import { Controller,Get, Post,Put ,UseGuards,Request,Param,Body, Delete, NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { redis } from "src/providers/database/redis.connection";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('product-review')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService){}

    @ApiBearerAuth()
    @ApiOperation({summary:'get product review'})
    @Get('products/:productId')
    async getProductReviews(@Param('productId') productId: number){
        return this.reviewService.getProductReviews(productId);
    }
    
    @ApiBearerAuth()
    @ApiOperation({summary:'give product review'})
    @Post(':productId')
    @UseGuards(JwtAuthGuard)
    async leaveReview(
        @Request() req: any,
        @Param('productId') productId: number,
        @Body() createReviewDto: CreateReviewDto, 
    ) {
        const userId = req.user.userId;
        const sessionStatus = await redis.get(userId) 
        if (sessionStatus === 'false') {
         return {
        message: 'User has logged out. Please log in again.',
        };
    }
        return this.reviewService.leaveReview(userId, productId, createReviewDto.rating, createReviewDto.comment);
    }

    @ApiBearerAuth()
    @ApiOperation({summary:'update product review'})
    @Put(':productId')
    @UseGuards(JwtAuthGuard)
    async updateReview(
        @Request() req: any,
        @Param('productId') productId: number,
        @Body() updateReviewDto: CreateReviewDto,
    ) {
        const userId = req.user.userId;
        const sessionStatus = await redis.get(userId) 
        if (sessionStatus === 'false') {
         return {
        message: 'User has logged out. Please log in again.',
         };
    }
        console.log('userId----------------',userId)
        return this.reviewService.updateReview(userId, productId, updateReviewDto);
    }
    
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('user-review')
    async getReviewsByUser(@Request() req) {
    const userId = req.user.userId; 
    return this.reviewService.getReviewsByUser(userId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // Protect this route with JWT authentication
  @Delete('delete/:id')
  async deleteReview(@Request() req, @Param('id') reviewId: number) {
    const userId = req.user.userId; // Get the user ID from the JWT token
    const deletedReview = await this.reviewService.deleteReview(userId, reviewId);
    
    if (!deletedReview) {
      throw new NotFoundException('Review not found.');
    }

    return { message: 'Review deleted successfully' };
  }

}
