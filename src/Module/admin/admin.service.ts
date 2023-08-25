import { Injectable, NotFoundException, UnauthorizedException, forwardRef } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./entity/admin.entity";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminUpdateDto } from "./dto/admin-update.dto";
import { Seller } from "../seller/entity/seller.entity";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async initAdmin() {
    // const adminUsername = this.configService.get<string>('ADMIN_USERNAME');
    
    const existingAdmin = await this.adminRepository.findOne({ where: { username: 'admin' } });
    // const existingAdmin = false;
    if (!existingAdmin) {
      const newAdmin = this.adminRepository.create({
        username: 'admin',
        firstName: 'admin',
        lastName: 'user',
        email: 'admin@exxample.com',
        password: await bcrypt.hash('Admin@123456', 10),
      });

      await this.adminRepository.save(newAdmin);
      console.log('Admin initialized.');
    } else {
      console.log('Admin already exists.');
    }
  }

  async createAdmin() {
    const adminUsername = 'admin';
    const adminFirstName = 'admin';
    const adminLastName = 'user';
    const adminEmail = 'admin@exxample.com';
    const adminPassword = 'Admin@123456';
      
    const admin = new Admin();
    admin.username = adminUsername;
    admin.firstName = adminFirstName;
    admin.lastName = adminLastName;
    admin.email = adminEmail;
    admin.password = await bcrypt.hash(adminPassword, 10);

    console.log(admin)
    await this.adminRepository.save(admin);
  }

  async login(loginDto: AdminLoginDto): Promise<string> {
    const { username, password } = loginDto;
    const admin = await this.adminRepository.findOne({where:{username}});

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const payload = { role:admin.role,username: admin.username, sub: admin.adminid };
      return this.jwtService.sign(payload);
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async updateAdmin(updateDto: AdminUpdateDto, userId: number, userRole: string) {
    const admin = await this.adminRepository.findOne({where:{adminid:userId}});
    // console.log(userId, userRole)
    // console.log(admin)
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }

    // Check if the authenticated user has the 'admin' role
    if (userRole !== 'admin') {
      throw new UnauthorizedException('You are not authorized to perform this action.');
    }

    // Update the admin details
    admin.firstName = updateDto.firstName;
    admin.lastName = updateDto.lastName;
    admin.email = updateDto.email;

    await this.adminRepository.save(admin);
  }

  async verifySeller(sellerid: number, userRole: string ) {
    console.log(userRole)
    if (userRole !== 'admin') {
      throw new UnauthorizedException('You are not authorized to perform this action.');
    }

    const seller = await this.sellerRepository.findOne({where:{sellerid}});
    if (!seller) {
      throw new NotFoundException('Seller not found.');
    }


    seller.verify = true;
    await this.sellerRepository.save(seller);
  }
}
