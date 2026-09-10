import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UuidBaseEntity } from '../../../common/entities/uuid-base.entity';
import { enumCheck } from '../../../common/utils/enum-check.util';
import { User } from '../../users/entities/user.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { Order } from './order.entity';

/**
 * Ai chuyển trạng thái đơn, khi nào — chỉ append, không có API sửa/xóa (service bảo vệ, không
 * phải DB). Tạo đơn ghi NULL → PENDING, actor là customer. Xem database.md mục 4 —
 * "order_status_history".
 */
@Entity({ name: 'order_status_history' })
@Index('idx_order_status_history_order_created_id', [
  'orderId',
  'createdAt',
  'id',
])
@Index('idx_order_status_history_actor', ['actorUserId'])
@Check(
  'ck_order_status_history_to_status',
  enumCheck('to_status', Object.values(OrderStatus)),
)
@Check(
  'ck_order_status_history_from_status',
  `from_status IS NULL OR ${enumCheck('from_status', Object.values(OrderStatus))}`,
)
@Check(
  'ck_order_status_history_transition',
  `(from_status IS NULL AND to_status = 'PENDING') OR (from_status IS NOT NULL AND from_status <> to_status)`,
)
export class OrderStatusHistory extends UuidBaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'from_status', type: 'varchar', length: 16, nullable: true })
  fromStatus: OrderStatus | null;

  @Column({ name: 'to_status', type: 'varchar', length: 16 })
  toStatus: OrderStatus;

  @Column({ name: 'actor_user_id', type: 'uuid', nullable: true })
  actorUserId: string | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'actor_user_id' })
  actorUser: User | null;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
