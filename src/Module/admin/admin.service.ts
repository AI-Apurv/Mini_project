import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Admin } from "./entity/admin.entity";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AdminUpdateDto } from "./dto/admin-update.dto";
import { AdminChangePasswordDto } from "./dto/change-password.dto";
import { Seller } from "../seller/entity/seller.entity";
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode'
import * as fs from 'fs';
import * as dotenv from 'dotenv'
import { redis } from "src/providers/database/redis.connection";
import * as nodemailer from 'nodemailer';
import { join } from "path";
import { readFileSync } from "fs";
import { ADMINRESPONSE, AdminResponseMessages } from "src/common/responses/admin.response";
import { sellerResponseMessage } from "src/common/responses/seller.response";
import { User } from "../users/entity/user.entity";
import { Userstatus } from "../users/user.model";

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    @InjectRepository(Seller)
    private sellerRepository: Repository<Seller>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) { dotenv.config() }

  async initAdmin() {
    const existingAdmin = await this.adminRepository.findOne({ where: { username: process.env.ADMIN_USERNAME } });
    if (!existingAdmin) {
      const newAdmin = this.adminRepository.create({
        username: process.env.ADMIN_USERNAME,
        firstName: process.env.FIRSTNAME,
        lastName: process.env.LASTNAME,
        email: process.env.ADMIN_EMAIL,
        password: await bcrypt.hash(process.env.ADMIN_PASS, 10),
      });
      this.generateTwoFactorSecret(newAdmin)
      await this.adminRepository.save(newAdmin);
    } else {
      console.log('Admin already exists.');
    }
  }




  async createAdmin() {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminFirstName = process.env.FIRSTNAME;
    const adminLastName = process.env.LASTNAME;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASS;

    const admin = new Admin();
    admin.username = adminUsername;
    admin.firstName = adminFirstName;
    admin.lastName = adminLastName;
    admin.email = adminEmail;
    admin.password = await bcrypt.hash(adminPassword, 10);
    await this.adminRepository.save(admin);
  }




  async updateAdmin(updateDto: AdminUpdateDto, adminId: number) {
    const admin = await this.adminRepository.findOne({ where: { adminid: adminId } });
    if (!admin) {
      throw new NotFoundException(AdminResponseMessages.NOT_FOUND);
    }
    admin.firstName = updateDto.firstName;
    admin.lastName = updateDto.lastName;
    admin.email = updateDto.email;
    await this.adminRepository.save(admin);
  }




  async verifySeller(sellerid: number) {
    const seller = await this.sellerRepository.findOne({ where: { sellerid } });
    if (!seller) {
      throw new NotFoundException(sellerResponseMessage.NOT_FOUND);
    }
    seller.verify = true;
    await this.sellerRepository.save(seller);
  }




  async login(loginDto: AdminLoginDto): Promise<string> {
    const { email, password, otp } = loginDto;
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException(AdminResponseMessages.NOT_FOUND);
    }
    if (admin && (await bcrypt.compare(password, admin.password))) {
      var verified = await speakeasy.totp.verify({
        secret: admin.secretKey,
        encoding: "ascii",
        token: otp,
      });
      if (!verified) {
        throw new UnauthorizedException(AdminResponseMessages.INVALID_TOKEN)
      }
      else {
        const payload = { role: admin.role, username: admin.username, sub: admin.adminid };
        return this.jwtService.sign(payload);
      }
    }
    throw new UnauthorizedException(AdminResponseMessages.INVALID_CREDENTIALS);
  }




  async generateTwoFactorSecret(admin: Admin) {
    var secret = speakeasy.generateSecret({
      name: admin.username,
    });
    const qrCodeDataURL = await new Promise<any>((resolve, reject) => {
      qrcode.toDataURL(secret.otpauth_url as any, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    const base64Data = qrCodeDataURL.split(";base64,").pop();
    const filePath = `qrcode-${admin.username}.png`;
    fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
    admin.secretKey = secret.ascii;
    this.adminRepository.save(admin);
  }




  async deleteUser(email: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException(AdminResponseMessages.NOT_FOUND)
    }
    await this.adminRepository.remove(admin);
  }




  async sendPasswordResetEmail(email: string): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    if (!admin) {
      throw new NotFoundException(AdminResponseMessages.NOT_FOUND);
    }
    const OTP = Math.floor(1000 + Math.random() * 9000);
    await redis.set(email, OTP.toString(), 'EX', 60)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const templatePath = join('/home/admin2/Desktop/dem/my-nest-app/src/email-template')
    const htmlTemplate = readFileSync(`${templatePath}/password-reset.html`, 'utf-8');
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: htmlTemplate.replace('{{ OTP }}', OTP.toString())
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        throw new InternalServerErrorException(AdminResponseMessages.MAIL_ERROR);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  }




  async resetPassword(email: string, otp: string, newPassword: string): Promise<string> {
    let redisOTP = await redis.get(email)
    console.log(redisOTP)
    if (redisOTP == otp) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const admin = await this.adminRepository.findOne({ where: { email } });
      if (admin)
        await redis.del(email)

      if (admin) {
        admin.password = hashedPassword;
        await this.adminRepository.save(admin);
        return AdminResponseMessages.PASSWORD_RESET_SUCCESS;
      }
    } else {
      console.log()
      throw new Error('Invalid OTP');
    }
  }




  async changePassword(adminId: number, adminchangePasswordDto: AdminChangePasswordDto): Promise<void> {
    const admin = await this.adminRepository.findOne({ where: { adminid: adminId } });
    if (!admin) {
      throw new Error(AdminResponseMessages.NOT_FOUND);
    }
    const isPasswordValid = await this.validateOldPassword(admin, adminchangePasswordDto.oldPassword);
    if (!isPasswordValid) {
      throw new BadRequestException(AdminResponseMessages.INVALID_PASSWORD)
    }
    if (adminchangePasswordDto.oldPassword === adminchangePasswordDto.newPassword) {
      throw new BadRequestException(AdminResponseMessages.DIFF_PASS)
    }
    admin.password = await this.hashPassword(adminchangePasswordDto.newPassword);
    await this.adminRepository.save(admin);
  }




  private async validateOldPassword(admin: Admin, oldPassword: string): Promise<boolean> {
    return await bcrypt.compare(oldPassword, admin.password)
  }




  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }



  async blockUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException(AdminResponseMessages.USER_NOT_FOUND)
    }
    user.userStatus = Userstatus.blocked;
    await this.userRepository.save(user);
  }



  
  async unblockUser(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } })
    if (!user) {
      throw new NotFoundException(AdminResponseMessages.USER_NOT_FOUND)
    }
    if (user.userStatus === Userstatus.blocked) {
      user.userStatus = Userstatus.inactive
    }
    else {
      throw new NotFoundException(AdminResponseMessages.NOT_BLOCKED)
    }
    await this.userRepository.save(user);
  }

}
