// address/address.service.ts
import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entity/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { User } from '../entity/user.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

 

  async addressExists(userId: number, createAddressDto: CreateAddressDto): Promise<boolean> {
    const { street, city, state, postalCode } = createAddressDto;
    const existingAddress = await this.addressRepository.findOne({
      where: {
        user: userId ,
        street,
        city,
        state,
        postalCode,
      },
    });
    console.log(existingAddress,'----------------------------')
    return !!existingAddress;
  }

  async createAddress(userId: number, createAddressDto : CreateAddressDto): Promise<Address> {
    const user = await this.userRepository.find({where:{id:userId}})
    const isAddressExists = await this.addressExists(userId, createAddressDto);
    if (isAddressExists) {
      throw new ConflictException('Address already exists');
    }

    const address = new Address()
    address.street = createAddressDto.street;
    address.city = createAddressDto.city;
    address.state = createAddressDto.state;
    address.postalCode = createAddressDto.postalCode;
    address.user = userId;

    return this.addressRepository.save(address)
}

  async updateAddress(addressId:number , updateAddressDto: UpdateAddressDto , userId:number):Promise<void>{
    const address = await this.addressRepository.findOne({where: {addressId:addressId , user:userId}});

    if(!address)
    {
      throw new NotFoundException('Address not found');
    }
    address.street = updateAddressDto.street;
    address.city = updateAddressDto.city;
    address.state = updateAddressDto.state;
    address.postalCode = updateAddressDto.postalCode

    await this.addressRepository.save(address);
  }

  async deleteAddress(addressId: number, userId: number): Promise<void> {
    const address = await this.addressRepository.findOne({where: {user:userId , addressId: addressId}});

    if (!address) {
      throw new NotFoundException('Address not found');
    }
    await this.addressRepository.remove(address);
  }


}
