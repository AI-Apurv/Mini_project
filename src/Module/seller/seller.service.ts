// seller.service.ts
import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from './entity/seller.entity';
import { SellerSignupDto } from './dto/seller-signup.dto';
import * as bcrypt from 'bcrypt';
import { SellerLoginDto } from './dto/seller-login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SellerService {
  constructor(
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private jwtService: JwtService
  ) {}

  async signup(signupDto: SellerSignupDto) {
    const { name, email, password , contactNumber} = signupDto;

    const existingSeller = await this.sellerRepository.findOne({where:{ email }});
    if (existingSeller) {
      throw new ConflictException('Seller with this email already exists.');
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSeller = this.sellerRepository.create({
      name,
      email,
      password: hashedPassword,
      contactNumber
    });

    await this.sellerRepository.save(newSeller);
  }

  async login(loginDto: SellerLoginDto) {
    const { email, password } = loginDto;

    const seller = await this.sellerRepository.findOne({where: {email}});

    if (!seller || !(await bcrypt.compare(password, seller.password))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const payload = { sub: seller.sellerid, email: seller.email, role:seller.role , verify:seller.verify};
    const token = this.jwtService.sign(payload);

    return token;
  }






  
}
