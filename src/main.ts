// "start:dev": "nest start --watch",
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './providers/config/swagger.config';
import * as dotenv from 'dotenv'
async function bootstrap() {

  if (process.env.NODE_ENV === 'qa') {
    dotenv.config({ path: '.env.qa' }); 
  } else if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.dev' });
  } else if (process.env.NODE_ENV === 'release'){
    dotenv.config({path:'.env.release'});
  }
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  console.log("@@@@@@@@@@@@@@@@@@@@@@@@@",process.env.PORT);
  await app.listen(process.env.PORT);
}
bootstrap();


