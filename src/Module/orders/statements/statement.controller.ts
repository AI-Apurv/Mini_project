import { Controller, UseGuards, Request, Get, Res, Post, NotFoundException } from '@nestjs/common';
import { StatementService } from './statements.service';
import { JwtAuthGuard } from 'src/Middleware/jwt.auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { httpResponse } from 'src/Middleware/httpResponse';
import { ORDERRESPONSE } from 'src/common/responses/order.response';
import { Response } from 'express';



@ApiTags('Transactions')
@Controller('statement')
export class StatementController {
  constructor(private readonly statementService: StatementService,
    private readonly httpResponse: httpResponse) { }




  /**
* @author Apurv
* @description This function will used for getting the transaction details
*/
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get Transaction detail' })
  @Get('transactions')
  @UseGuards(JwtAuthGuard)
  async getTransactions(@Request() req: any, @Res() response: Response) {
    const id = req.user.userId;
    const transactions = await this.statementService.getTransactionsById(id);
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.TRANSACTION, transactions)
  }




  /**
  * @author Apurv
  * @description This function will return total seller earning
  */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get Total seller earning' })
  @Get('seller-total-earning')
  @UseGuards(JwtAuthGuard)
  async getTotalEarning(@Request() req, @Res() response: Response) {
    const sellerId = req.user.userId;
    const totalEarnings = await this.statementService.calculateTotalEarnings(sellerId);
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.SELLER_EARNING, totalEarnings)
  }





  /**
  * @author Apurv
  * @description This function will return total platform earning
  */
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get Total Platform Earnings' })
  @Get('platform-total-earning')
  @UseGuards(JwtAuthGuard)
  async getPlatformTotalEarning(@Request() req, @Res() response: Response) {
    const platformTotalEarnings = await this.statementService.calculatePlatformTotalEarnings();
    return this.httpResponse.sendResponse(response, ORDERRESPONSE.PLATFORM_EARNING, platformTotalEarnings)
  }





}