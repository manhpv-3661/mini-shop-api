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
import { enumCheck } from '../../../common/utils/enum-check.util';
import { sha256HexCheck } from '../../../common/utils/sha256-hex-check.util';
import { User } from '../../users/entities/user.entity';
import {
  MAX_ORDER_TOTAL_VND,
  MIN_ORDER_TOTAL_VND,
} from '../constants/orders.constants';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

/**
 * Header của đơn. `POST /orders` không nhận total/price/userId/status từ client — server tính
 * và ghi trong transaction cùng order_items/order_status_history/email_notifications (mục 4+6
 * database.md — "orders"). Payment hiện chỉ COD; giữ dạng varchar+CHECK để mở rộng sau nếu cần.
 */
@Entity({ name: 'orders' })
@Unique('uq_orders_user_idempotency_key', ['userId', 'idempotencyKey'])
@Index('idx_orders_user_created_id', ['userId', 'createdAt', 'id'])
@Index('idx_orders_status_created_id', ['status', 'createdAt', 'id'])
@Index('idx_orders_created_id', ['createdAt', 'id'])
@Index('idx_orders_completed_stats', ['status', 'completedAt', 'id'], {
  where: `status = 'COMPLETED'`,
})
@Check('ck_orders_status', enumCheck('status', Object.values(OrderStatus)))
@Check('ck_orders_payment_method', `payment_method = 'COD'`)
@Check(
  'ck_orders_total_range',
  `total_vnd BETWEEN ${MIN_ORDER_TOTAL_VND} AND ${MAX_ORDER_TOTAL_VND}`,
)
@Check('ck_orders_request_hash_format', sha256HexCheck('request_hash'))
@Check(
  'ck_orders_completed_at_consistency',
  `(status = 'COMPLETED') = (completed_at IS NOT NULL)`,
)
@Check(
  'ck_orders_rejection_reason_consistency',
  `(status = 'REJECTED' AND rejection_reason IS NOT NULL AND btrim(rejection_reason) <> '') OR ` +
    `(status <> 'REJECTED' AND rejection_reason IS NULL)`,
)
export class Order extends UuidBaseEntity {
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 16, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ name: 'total_vnd', type: 'numeric', precision: 14, scale: 0 })
  totalVnd: string;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 16,
    default: 'COD',
  })
  paymentMethod: 'COD';

  @Column({ name: 'recipient_name', type: 'varchar', length: 100 })
  recipientName: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @Column({ name: 'address_snapshot', type: 'text' })
  addressSnapshot: string;

  @Column({ name: 'customer_note', type: 'text', nullable: true })
  customerNote: string | null;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string | null;

  @Column({ name: 'idempotency_key', type: 'uuid' })
  idempotencyKey: string;

  @Column({ name: 'request_hash', type: 'char', length: 64 })
  requestHash: string;

  @Column({ name: 'completed_at', type: 'timestamptz', nullable: true })
  completedAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
