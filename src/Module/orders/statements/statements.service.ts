import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Statement } from './entity/statement.entity';

@Injectable()
export class StatementService {
  constructor(
    @InjectRepository(Statement)
    private readonly statementRepository: Repository<Statement>,
  ) {}
    async getTransactionsById(id:number): Promise<{message: string; transactions:Statement[]}>{
      const transactions = await this.statementRepository.find({where:[ {creditId:id},{debitId:id}]})
      return { message: `Your id is ${id}`, transactions };
      
    }

    async calculateTotalEarnings(sellerId:number):Promise<number>{
      try{
        const transactions = await this.statementRepository.find({
          where: [{ creditId: sellerId }, { debitId: sellerId }],
        });
        const totalEarnings = transactions.reduce((total, transaction) => {
          if (transaction.creditId === sellerId) {
            total += +transaction.amount;
          } else if (transaction.debitId === sellerId) {
            total -= +transaction.amount;
          }
          
          return total;
        }, 0);
        const platformFees = (totalEarnings * 0.05); // 5% as platform fees
        const earningsAfterFees = totalEarnings - platformFees;
        return earningsAfterFees;
      }
      catch(err){
        throw err;
      }
    }

    async calculatePlatformTotalEarnings(): Promise<number> {
      try {
        const transactions = await this.statementRepository.find();
        const totalAmount = transactions.reduce((total, transaction) => {
          total += +transaction.amount;
          return total;
        }, 0);
        
        const platformEarnings = totalAmount * 0.02; // 2% as platform earnings
        return platformEarnings;
      } catch (err) {
        throw err;
      }
    }
  
}
