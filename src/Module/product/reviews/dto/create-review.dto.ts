import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {

    @ApiProperty()
    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    comment: string;
}
