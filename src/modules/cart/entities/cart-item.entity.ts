import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UuidBaseEntity } from '../../../common/entities/uuid-base.entity';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { MAX_LINE_ITEM_QUANTITY } from '../constants/cart.constants';

/**
 * Một dòng trong giỏ của user. Không có bảng carts riêng vì mỗi user chỉ có một giỏ hiện hành.
 * Giỏ chưa giữ chỗ tồn kho; chỉ checkout mới trừ tồn (rule ở service, mục 4 database.md — "cart_items").
 */
@Entity({ name: 'cart_items' })
@Unique('uq_cart_items_user_product', ['userId', 'productId'])
@Index('idx_cart_items_product', ['productId'])
@Check(
  'ck_cart_items_quantity_range',
  `quantity BETWEEN 1 AND ${MAX_LINE_ITEM_QUANTITY}`,
)
export class CartItem extends UuidBaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'int' })
  quantity: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
