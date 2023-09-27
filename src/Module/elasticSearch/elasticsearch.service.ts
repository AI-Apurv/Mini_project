import { Injectable } from '@nestjs/common';
import { ElasticsearchService as NestElasticsearchService } from '@nestjs/elasticsearch';
import { ElasticsearchResponse } from './elasticsearch.model';



@Injectable()
export class ElasticsearchService {
  constructor(private readonly elasticsearchService: NestElasticsearchService) { }

  async indexProduct(product: any) {
    const body = await this.elasticsearchService.index<ElasticsearchResponse<any>>({
      index: 'products',
      body: product,
    });
    return body;
  }

  async searchProducts(query: string) {
    const body = await this.elasticsearchService.search<any>({
      index: 'products',
      body: {
        query: {
          wildcard: {
            name: `*${query.toLowerCase()}*`,
          },
        },
      },
    });
    return body.hits.hits.map((hit) => ({
      productid: hit._source.productid,
      name: hit._source.name,
      price: hit._source.price,
      quantity: hit._source.quantity,
      rating: hit._source.rating,
      totalReview: hit._source.totalReview,
    }));
  }
}
