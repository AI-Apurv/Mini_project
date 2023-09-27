import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Address Id is required' })
  @IsNumber()
  addressId: number;


}
