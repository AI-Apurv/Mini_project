// cart-update.dto.ts

import { ApiProperty } from "@nestjs/swagger";

export class CartUpdateDto {
    
    @ApiProperty()
    productId: number;

    @ApiProperty()
    quantity: number;
  }
  