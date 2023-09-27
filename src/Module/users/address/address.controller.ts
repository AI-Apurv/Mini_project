import { Controller, Post, Body, UseGuards, Request, Put, Param, Delete, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddressResponseMessages } from 'src/common/responses/address.response';


@ApiTags('Address')
@UseGuards(JwtAuthGuard)
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}
  

   /**
 * @author Apurv
 * @description This function will used for adding new address
 * @Body CreateAddressDto
 * @payload street , city , state , postal code
 */
  @ApiBearerAuth()
  @ApiOperation({summary:'add  new address'})
  @Post('add')
  async create(@Body() createAddressDto: CreateAddressDto, @Request() req:any){
    const userId = req.user.userId ;
    

    try{
      const createAddress=  await this.addressService.createAddress(userId,createAddressDto);
      return {message: AddressResponseMessages.ADDRESS_CREATED, address: createAddress}
    }
    catch(error)
    {
      if(error instanceof ConflictException){
        throw new ConflictException(AddressResponseMessages.ADDRESS_EXIST)
      }
      throw error ;
    }
  }

   /**
 * @author Apurv
 * @description This function will used for updating the existing address
 * @Body updateAddressDto
 * @payload street , city , state , postal code
 */
  @ApiBearerAuth()
  @ApiOperation({summary:'update the existing address'})
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') addressId: number , @Body() updateAddressDto:UpdateAddressDto, @Request() req:any)
  {
    const userId = req.user.userId;
    await this.addressService.updateAddress(addressId, updateAddressDto , userId)
    return {message : AddressResponseMessages.ADDRESS_UPDATED}
  }

   /**
 * @author Apurv
 * @description This function will used for deleting the address
 * @Param addressId
 */
  @ApiBearerAuth()
  @ApiOperation({summary:'Delete the address'})
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') addressId: number, @Request() req: any) {
    const userId = req.user.userId;
    await this.addressService.deleteAddress(addressId, userId);
    return { message: AddressResponseMessages.ADDRESS_DELETED };
  }

}
