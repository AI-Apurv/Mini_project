import { Body, Controller, Patch, Post, UseGuards, ValidationPipe,Request, Param, ParseIntPipe} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { AdminUpdateDto } from "./dto/admin-update.dto";
import { SellerService } from "../seller/seller.service";



@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService,
               ) {}

   
    async createAdmin() {
      await this.adminService.createAdmin();
      return { message: 'Admin created successfully.' };
    }

    @Post('login')
    async login(@Body() loginDto: AdminLoginDto) {
      const token = await this.adminService.login(loginDto);
      return { token };
    }

    @Patch('update')
    @UseGuards(JwtAuthGuard) // Apply JWT guard
    async updateAdmin(@Body(new ValidationPipe()) updateDto: AdminUpdateDto,  @Request() req: any) {
        const {id,role} = req.user ;
        console.log(id, role)
      await this.adminService.updateAdmin(updateDto,id,role);
      return { message: 'Admin updated successfully.' };
    }

    @Post(':sellerid/verify')
    @UseGuards(JwtAuthGuard)
    async verifySeller(@Param('sellerid') sellerid: number, @Request() req:any) {
      const admin = req.user;
      console.log(sellerid,"-----------")
      await this.adminService.verifySeller(sellerid,admin.role);
      return { message: 'Seller verified successfully.' };
    }

    
    

}
