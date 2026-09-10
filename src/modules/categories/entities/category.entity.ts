import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UuidBaseEntity } from '../../../common/entities/uuid-base.entity';

/**
 * Nhóm sản phẩm. Chỉ hard-delete danh mục rỗng (rule ở service — ProductsService.exists() theo
 * category); ẩn danh mục (is_active=false) cũng ẩn sản phẩm khỏi public/checkout. Xem
 * docs/planning/database.md mục 4 — "categories".
 */
@Entity({ name: 'categories' })
@Unique('uq_categories_slug', ['slug'])
@Index('idx_categories_active_created_id', ['isActive', 'createdAt', 'id'])
@Index('idx_categories_created_id', ['createdAt', 'id'])
export class Category extends UuidBaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 120 })
  slug: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
