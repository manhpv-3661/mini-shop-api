import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { UuidBaseEntity } from '../../../common/entities/uuid-base.entity';
import { MAX_LINE_ITEM_QUANTITY } from '../../cart/constants/cart.constants';
import {
  MAX_PRODUCT_PRICE_VND,
  MIN_PRODUCT_PRICE_VND,
} from '../../products/constants/products.constants';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

/**
 * Dữ liệu snapshot tại thời điểm mua — bất biến sau khi tạo đơn, không JOIN tên/giá hiện tại của
 * product cho đơn cũ (mục 4 database.md — "order_items"). Cận giá/số lượng tái sử dụng từ
 * `products`/`cart` (CODING_STANDARD mục 15 — `orders` đã có dependency → 2 module đó sẵn, không
 * định nghĩa lại cùng một cận ở nơi thứ ba).
 */
@Entity({ name: 'order_items' })
@Unique('uq_order_items_order_product', ['orderId', 'productId'])
@Index('idx_order_items_product', ['productId'])
@Check(
  'ck_order_items_unit_price_range',
  `unit_price_vnd BETWEEN ${MIN_PRODUCT_PRICE_VND} AND ${MAX_PRODUCT_PRICE_VND}`,
)
@Check(
  'ck_order_items_quantity_range',
  `quantity BETWEEN 1 AND ${MAX_LINE_ITEM_QUANTITY}`,
)
@Check(
  'ck_order_items_line_total_matches',
  `line_total_vnd = unit_price_vnd * quantity`,
)
export class OrderItem extends UuidBaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_name_snapshot', type: 'varchar', length: 200 })
  productNameSnapshot: string;

  @Column({ name: 'sku_snapshot', type: 'varchar', length: 64 })
  skuSnapshot: string;

  @Column({ name: 'unit_price_vnd', type: 'numeric', precision: 14, scale: 0 })
  unitPriceVnd: string;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ name: 'line_total_vnd', type: 'numeric', precision: 14, scale: 0 })
  lineTotalVnd: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
