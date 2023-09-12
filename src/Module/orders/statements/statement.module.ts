import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatementController } from './statement.controller';
import { StatementService } from './statements.service';
import { Statement } from './entity/statement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Statement])],
  controllers: [StatementController],
  providers: [StatementService],
})
export class StatementModule {}
