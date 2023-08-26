import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Session } from 'src/Module/users/entity/session.entity';
import { Admin } from 'src/Module/admin/entity/admin.entity';
import { User } from 'src/Module/users/entity/user.entity';
import { Category } from 'src/Module/admin/productCategory/entity/category.entity';
import { Seller } from 'src/Module/seller/entity/seller.entity';
import { Product } from 'src/Module/product/entity/product.entity';
import { Cart } from 'src/Module/users/cart/entity/cart.entity';
import { Order } from 'src/Module/orders/entity/order.entity';

const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '      ',
  database: 'Myntra',
  synchronize: true,
  entities: [User,Admin,Session,Category,Seller,Product,Cart,Order],
};

export default typeOrmConfig;