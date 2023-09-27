import { Module } from '@nestjs/common';
import { ElasticsearchModule as NestElasticsearchModule } from '@nestjs/elasticsearch';

@Module({
  imports: [
    NestElasticsearchModule.register({
      node: 'http://localhost:9200',
    }),
  ],
  exports: [NestElasticsearchModule],
})
export class ElasticsearchModule { }
