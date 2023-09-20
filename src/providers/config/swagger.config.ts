import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('E-Commerce')
    .setDescription('E-Commerce API')
    .setVersion('1.0')
    .addTag('APIs')
    .addBearerAuth()
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  let swaggerPort ;
  if (process.env.NODE_ENV === 'qa') {
    console.log('>>>>>>>>>>>>>>>>>>>>>>',process.env.PORT);
    swaggerPort = process.env.PORT ;
  }
  else if (process.env.NODE_ENV === 'release'){
    swaggerPort = process.env.PORT;
  } else {
    swaggerPort = process.env.PORT ;
  }

  SwaggerModule.setup('api', app, document, {swaggerOptions:{port:swaggerPort}});
}
