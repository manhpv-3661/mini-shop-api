import { Exclude } from 'class-transformer';
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
import { AuthToken } from '../../auth/entities/auth-token.entity';
import { Order } from '../../orders/entities/order.entity';
import { MAX_EMAIL_NOTIFICATION_ATTEMPTS } from '../constants/notifications.constants';
import { EmailNotificationEventType } from '../enums/email-notification-event-type.enum';
import { EmailNotificationStatus } from '../enums/email-notification-status.enum';

/**
 * Outbox — ý định gửi email được lưu bền, ghi cùng transaction với sự kiện phát sinh (register,
 * order transition, monthly cron). Redis/Bull chỉ là hàng đợi thực thi, không phải nguồn sự thật.
 * Đúng một trong ba context (auth/order/report); payload không chứa password/token thật (mục 4
 * database.md — "email_notifications").
 */
@Entity({ name: 'email_notifications' })
@Index('idx_email_notifications_auth_token', ['authTokenId'], {
  unique: true,
  where: `auth_token_id IS NOT NULL`,
})
@Index('idx_email_notifications_order_event', ['orderId', 'eventType'], {
  unique: true,
  where: `order_id IS NOT NULL`,
})
@Index(
  'idx_email_notifications_report_recipient',
  ['recipientEmail', 'eventType', 'reportPeriod'],
  { unique: true, where: `report_period IS NOT NULL` },
)
@Index('idx_email_notifications_status_updated_id', [
  'status',
  'updatedAt',
  'id',
])
@Check(
  'ck_email_notifications_event_type',
  enumCheck('event_type', Object.values(EmailNotificationEventType)),
)
@Check(
  'ck_email_notifications_status',
  enumCheck('status', Object.values(EmailNotificationStatus)),
)
@Check('ck_email_notifications_locale', enumCheck('locale', ['vi', 'en']))
@Check(
  'ck_email_notifications_attempts_range',
  `attempts BETWEEN 0 AND ${MAX_EMAIL_NOTIFICATION_ATTEMPTS}`,
)
@Check(
  'ck_email_notifications_payload_is_object',
  `jsonb_typeof(payload) = 'object'`,
)
@Check(
  'ck_email_notifications_single_context',
  `(auth_token_id IS NOT NULL AND order_id IS NULL AND report_period IS NULL) OR ` +
    `(order_id IS NOT NULL AND auth_token_id IS NULL AND report_period IS NULL) OR ` +
    `(report_period IS NOT NULL AND auth_token_id IS NULL AND order_id IS NULL)`,
)
@Check(
  'ck_email_notifications_secret_only_for_auth',
  `secret_ciphertext IS NULL OR auth_token_id IS NOT NULL`,
)
export class EmailNotification extends UuidBaseEntity {
  @Column({ name: 'order_id', type: 'uuid', nullable: true })
  orderId: string | null;

  @ManyToOne(() => Order, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order | null;

  @Column({ name: 'auth_token_id', type: 'uuid', nullable: true })
  authTokenId: string | null;

  @ManyToOne(() => AuthToken, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'auth_token_id' })
  authToken: AuthToken | null;

  @Column({ name: 'report_period', type: 'date', nullable: true })
  reportPeriod: string | null;

  @Column({ name: 'event_type', type: 'varchar', length: 32 })
  eventType: EmailNotificationEventType;

  @Column({ name: 'recipient_email', type: 'varchar', length: 254 })
  recipientEmail: string;

  @Column({ type: 'varchar', length: 2 })
  locale: 'vi' | 'en';

  @Column({ type: 'jsonb' })
  payload: Record<string, unknown>;

  /**
   * Phòng thủ theo chiều sâu: đây là raw activation/reset token đã mã hoá — không có endpoint nào
   * cố ý trả field này, nhưng `@Exclude()` chặn cả trường hợp lỡ serialize entity thô (xem lý do
   * tương tự ở `User.passwordHash`).
   */
  @Exclude()
  @Column({ name: 'secret_ciphertext', type: 'bytea', nullable: true })
  secretCiphertext: Buffer | null;

  @Column({
    type: 'varchar',
    length: 16,
    default: EmailNotificationStatus.PENDING,
  })
  status: EmailNotificationStatus;

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ name: 'sent_at', type: 'timestamptz', nullable: true })
  sentAt: Date | null;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
