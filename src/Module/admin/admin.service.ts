//git fetch vs git fetch --all
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
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode'
import * as fs from 'fs';

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
    
    const existingAdmin = await this.adminRepository.findOne({ where: { username: 'as' } });
    if (!existingAdmin) {
      const newAdmin = this.adminRepository.create({
        username: 'as',
        firstName: 'a',
        lastName: 's',
        email: 'as@gmail.com',
        password: await bcrypt.hash('Admin@123456', 10),
      });
      

      await this.adminRepository.save(newAdmin);
      console.log('Admin initialized.');
    } else {
      console.log('Admin already exists.');
    }
  }

  async createAdmin() {
    const adminUsername = 'as';
    const adminFirstName = 'a';
    const adminLastName = 'a';
    const adminEmail = 'as@gamil.com';
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

  async login(loginDto: AdminLoginDto): Promise<string> {
    console.log('inside the service-------')
    const { email, password,otp} = loginDto;
    const admin = await this.adminRepository.findOne({where:{email}});
    console.log('admin---------------',admin)
    if (!admin) {
      throw new NotFoundException('Admin not found.');
    }

    
  
  if (admin && (await bcrypt.compare(password, admin.password))) {
    var verified = await speakeasy.totp.verify({      
      secret: admin.secretKey,      
      encoding: "ascii",      
      token: otp,    
    });    
    console.log(verified);
    if(!verified)
    {
      throw new UnauthorizedException('Invalid token')
    }
    else {
      const payload = { role:admin.role,username: admin.username, sub: admin.adminid };
      return this.jwtService.sign(payload);
    }
   
      
      
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async generateQRCode(otpauthUrl: string): Promise<string> {        
    return new Promise((resolve, reject) => {            
      qrcode.toFile('./qrcode.png', otpauthUrl, (err) => {                
        if (err) {                    
          console.error('Error generating QR code:', err);                    
          reject(err);                
        } else {                    
          console.log('QR code image saved as qrcode.png');                    
          resolve('./qrcode.png');                
        }            
      });        
    });    
  }

  async generateTwoFactorSecret(admin: Admin) {

    var secret = speakeasy.generateSecret({      
      name: admin.username,    
    });    
    console.log(secret);    
    const qrCodeDataURL = await new Promise<any>((resolve, reject) => {      
      qrcode.toDataURL(secret.otpauth_url as any, (err, data) => {        
        if (err) {          
          reject(err);        
        } else {          
          resolve(data);        
        }      
      });    
    });    
    console.log(qrCodeDataURL);   
    console.log('-----------------------new line 1') 
    const base64Data = qrCodeDataURL.split(";base64,").pop(); 
    console.log('-----------------------new line 2', admin.username)   
    const filePath = `qrcode-${admin.username}.png`;   
    console.log('-----------------------new line 3',filePath) 

    fs.writeFileSync(filePath, base64Data, { encoding: "base64" }); 
    console.log('-----------------------new line 4')   
    console.log("PNG file generated:", filePath);
    admin.secretKey = secret.ascii;
    this.adminRepository.save(admin);
  }

}
