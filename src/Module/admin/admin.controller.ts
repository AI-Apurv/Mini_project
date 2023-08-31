import { Body, Controller, Patch, Post, UseGuards, ValidationPipe,Request, Param, ParseIntPipe} from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDto } from "./dto/admin-login.dto";
import { AuthGuard } from "@nestjs/passport";
import { JwtAuthGuard } from "src/Middleware/jwt.auth.guard";
import { AdminUpdateDto } from "./dto/admin-update.dto";
import { SellerService } from "../seller/seller.service";
import { AdminResponseMessages } from "src/common/responses/admin.response";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Admin')
@Controller('admins')
export class AdminController {
    constructor(private readonly adminService: AdminService,
               ) {}

   
    async createAdmin() {
      await this.adminService.createAdmin();
      return { message: AdminResponseMessages.ADMIN_CREATED };
    }

    @ApiOperation({summary:'Admin Login'})
    @Post('login')
    async login(@Body() loginDto: AdminLoginDto) {
      console.log("inside the controller---------")
      const token = await this.adminService.login(loginDto);
      return { token };
    }

    @ApiOperation({summary:'update admin details'})
    @Patch('update')
    @UseGuards(JwtAuthGuard) // Apply JWT guard
    async updateAdmin(@Body(new ValidationPipe()) updateDto: AdminUpdateDto,  @Request() req: any) {
        const {id,role} = req.user ;
        console.log(id, role)
      await this.adminService.updateAdmin(updateDto,id,role);
      return { message: AdminResponseMessages.UPDATE_SUCCESS };
    }

    @ApiOperation({summary:'Verify the Sellers'})
    @Post(':sellerid/verify')
    @UseGuards(JwtAuthGuard)
    async verifySeller(@Param('sellerid') sellerid: number, @Request() req:any) {
      const admin = req.user;
      console.log(sellerid,"-----------")
      await this.adminService.verifySeller(sellerid,admin.role);
      return { message: AdminResponseMessages.VERIFY_SELLER_SUCCESS };
    }

    
    

}
