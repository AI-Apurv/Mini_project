import { Controller, UseGuards,Request,Get, Post, NotFoundException } from '@nestjs/common';
import { StatementService } from './statements.service';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Transactions')
@Controller('statement')
export class StatementController {
    constructor(private readonly statementService: StatementService) {}    
  
  @ApiBearerAuth()
  @ApiOperation({summary:'get Transaction detail'})
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Request() req:any){
    const id = req.user.userId;
    console.log(id)
    const transactions = await this.statementService.getTransactionsById(id);
    return transactions;
  }

  @ApiBearerAuth()
  @ApiOperation({summary:'get Total seller earning'})
  @Get('seller-total-earning')
  @UseGuards(JwtAuthGuard)
  async getTotalEarning(@Request() req){
    const sellerId = req.user.userId;
    console.log(sellerId)
    const totalEarnings = await this.statementService.calculateTotalEarnings(sellerId);
    return {totalEarnings}
  }
 
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Total Platform Earnings' })
  @Get('platform-total-earning')
  @UseGuards(JwtAuthGuard)
  async getPlatformTotalEarning(@Request() req) {
    const role = req.user.role;
    if(role!=='admin')
    throw new NotFoundException('Only admin are allowed')

    const platformTotalEarnings = await this.statementService.calculatePlatformTotalEarnings();
    return { platformTotalEarnings };
  }
  
  }