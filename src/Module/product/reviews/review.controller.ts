import { Controller, Get, Post, Res, Put, UseGuards, Request, Param, Body, Delete, NotFoundException } from "@nestjs/common";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { CreateReviewDto } from "./dto/create-review.dto";
import { ReviewService } from "./review.service";
import { redis } from "src/providers/database/redis.connection";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { httpResponse } from "src/Middleware/httpResponse";
import { PRODUCTRESPONSE } from "src/common/responses/product.response";
import {Response} from 'express';

@ApiTags('product-review')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService, private readonly httpResponse: httpResponse) { }




    /**
* @author Apurv
* @description This function will used for getting the product reviews
* @Param productId
*/
    @ApiBearerAuth()
    @ApiOperation({ summary: 'get product review' })
    @Get('products/:productId')
    async getProductReviews(@Param('productId') productId: number, @Res() response:Response) {
        const reviews = this.reviewService.getProductReviews(productId);
        return this.httpResponse.sendResponse(response,PRODUCTRESPONSE.REVIEW,reviews)
    }




    /**
* @author Apurv
* @description This function will used by user to write review of product
* @Body CreateReviewDto
* @Param productId
* @payload rating , comment
*/
    @ApiBearerAuth()
    @ApiOperation({ summary: 'give product review' })
    @Post(':productId')
    @UseGuards(JwtAuthGuard)
    async leaveReview(@Request() req: any, @Param('productId') productId: number, @Body() createReviewDto: CreateReviewDto) {
        const userId = req.user.userId;
        return this.reviewService.leaveReview(userId, productId, createReviewDto.rating, createReviewDto.comment);
    }




    /**
* @author Apurv
* @description This function will used user to update their review
* @Body CreateReviewDto
* @payload productId
*/
    @ApiBearerAuth()
    @ApiOperation({ summary: 'update product review' })
    @Put(':productId')
    @UseGuards(JwtAuthGuard)
    async updateReview(@Request() req: any, @Param('productId') productId: number, @Body() updateReviewDto: CreateReviewDto) {
        const userId = req.user.userId;
        return this.reviewService.updateReview(userId, productId, updateReviewDto);
    }




    /**
* @author Apurv
* @description This function will used to get all the review given by user
*/
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('user-review')
    async getReviewsByUser(@Request() req) {
        const userId = req.user.userId;
        return this.reviewService.getReviewsByUser(userId);
    }




    /**
  * @author Apurv
  * @description This function will used for deleting a review
  * @Param reviewId
  */
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
