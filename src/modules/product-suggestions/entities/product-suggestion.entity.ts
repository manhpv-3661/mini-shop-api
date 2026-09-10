import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { UuidBaseEntity } from '../../../common/entities/uuid-base.entity';
import { enumCheck } from '../../../common/utils/enum-check.util';
import { User } from '../../users/entities/user.entity';
import {
  MAX_SUGGESTION_NAME_LENGTH,
  MIN_SUGGESTION_NAME_LENGTH,
} from '../constants/product-suggestions.constants';

export enum ProductSuggestionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

/**
 * Workflow gợi ý sản phẩm PENDING → APPROVED|REJECTED. Approve KHÔNG tự tạo product (vẫn cần
 * SKU/giá/tồn/ảnh — service riêng). Xem database.md mục 4 — "product_suggestions".
 */
@Entity({ name: 'product_suggestions' })
@Index('idx_product_suggestions_customer_created_id', [
  'customerId',
  'createdAt',
  'id',
])
@Index('idx_product_suggestions_status_created_id', [
  'status',
  'createdAt',
  'id',
])
@Index('idx_product_suggestions_reviewed_by', ['reviewedBy'])
@Check(
  'ck_product_suggestions_name_length',
  `char_length(name) BETWEEN ${MIN_SUGGESTION_NAME_LENGTH} AND ${MAX_SUGGESTION_NAME_LENGTH}`,
)
@Check(
  'ck_product_suggestions_status',
  enumCheck('status', Object.values(ProductSuggestionStatus)),
)
@Check(
  'ck_product_suggestions_review_consistency',
  `(status = 'PENDING' AND reviewed_by IS NULL AND reviewed_at IS NULL AND review_reason IS NULL) OR ` +
    `(status = 'APPROVED' AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL) OR ` +
    `(status = 'REJECTED' AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL AND ` +
    `review_reason IS NOT NULL AND btrim(review_reason) <> '')`,
)
export class ProductSuggestion extends UuidBaseEntity {
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({
    name: 'category_name',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  categoryName: string | null;

  @Column({
    type: 'varchar',
    length: 16,
    default: ProductSuggestionStatus.PENDING,
  })
  status: ProductSuggestionStatus;

  @Column({ name: 'reviewed_by', type: 'uuid', nullable: true })
  reviewedBy: string | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'reviewed_by' })
  reviewer: User | null;

  @Column({ name: 'review_reason', type: 'text', nullable: true })
  reviewReason: string | null;

  @Column({ name: 'reviewed_at', type: 'timestamptz', nullable: true })
  reviewedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
