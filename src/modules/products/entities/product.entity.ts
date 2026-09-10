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
import { Attachment } from '../../attachments/entities/attachment.entity';
import { Category } from '../../categories/entities/category.entity';
import {
  MAX_PRODUCT_PRICE_VND,
  MIN_PRODUCT_PRICE_VND,
} from '../constants/products.constants';

/**
 * Giá và tồn hiện tại của sản phẩm. Cart giữ product ID và đọc giá mới nhất khi xem; order item
 * giữ snapshot giá khi mua (không đọc lại từ bảng này cho đơn cũ). Xem
 * docs/planning/database.md mục 4 — "products".
 */
@Entity({ name: 'products' })
@Unique('uq_products_sku', ['sku'])
@Unique('uq_products_image_id', ['imageId'])
@Index('idx_products_active_created_id', ['isActive', 'createdAt', 'id'])
@Index('idx_products_category_active_created_id', [
  'categoryId',
  'isActive',
  'createdAt',
  'id',
])
@Index('idx_products_created_id', ['createdAt', 'id'])
@Check(
  'ck_products_price_range',
  `price_vnd BETWEEN ${MIN_PRODUCT_PRICE_VND} AND ${MAX_PRODUCT_PRICE_VND}`,
)
@Check('ck_products_stock_nonnegative', `stock >= 0`)
export class Product extends UuidBaseEntity {
  @Column({ name: 'category_id', type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Category, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'image_id', type: 'uuid', nullable: true })
  imageId: string | null;

  @ManyToOne(() => Attachment, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'image_id' })
  image: Attachment | null;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 64 })
  sku: string;

  @Column({ name: 'price_vnd', type: 'numeric', precision: 14, scale: 0 })
  priceVnd: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
