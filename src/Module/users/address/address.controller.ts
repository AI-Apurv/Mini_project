import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';

@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post('upload')
  async uploadAddress(@Body() addressDto: CreateAddressDto) {
    const createdAddress = await this.addressService.createAddress(addressDto);
    return { message: 'Address uploaded successfully', address: createdAddress };
  }
}
