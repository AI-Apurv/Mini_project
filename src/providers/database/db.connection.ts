import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Session } from 'src/Module/users/entity/session.entity';
import { Admin } from 'src/Module/admin/entity/admin.entity';
import { User } from 'src/Module/users/entity/user.entity';
import { Category } from 'src/Module/admin/productCategory/entity/category.entity';
import { Seller } from 'src/Module/seller/entity/seller.entity';
import { Product } from 'src/Module/product/entity/product.entity';
import { Cart } from 'src/Module/users/cart/entity/cart.entity';
import { Order } from 'src/Module/orders/entity/order.entity';
import { Review } from 'src/Module/product/reviews/entity/review.entity';
import { Address } from 'src/Module/users/address/entity/address.entity';
import { Statement } from 'src/Module/orders/statements/entity/statement.entity';
import { DeliveryBoy } from 'src/Module/delievery-boy/entity/del.entity';
// import { MessageEntity } from 'src/Module/chat/entity/chat.entity';
import { Message } from 'src/Module/chat/entity/chat.entity';
import { Event } from 'src/Module/Event/entity/event.entity';
const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '      ',
  database: 'Myntra',
  synchronize: true,
  entities: [User,Admin,Session,Category,Seller,Product,Cart,Order,Review,Address,Statement,DeliveryBoy,Message,Event],
};

export default typeOrmConfig;