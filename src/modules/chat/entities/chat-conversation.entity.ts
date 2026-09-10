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
import { ChatConversationStatus } from '../enums/chat-conversation-status.enum';

/**
 * Một phiên support giữa customer và admin. Mỗi customer chỉ có tối đa một conversation OPEN
 * (partial unique index); CLOSED không nhận message, mở lại tạo conversation mới (mục 4
 * database.md — "chat_conversations").
 */
@Entity({ name: 'chat_conversations' })
@Index('idx_chat_conversations_customer_open', ['customerId'], {
  unique: true,
  where: `status = 'OPEN'`,
})
@Index('idx_chat_conversations_status_last_message_id', [
  'status',
  'lastMessageAt',
  'id',
])
@Index('idx_chat_conversations_admin_status_last_message_id', [
  'assignedAdminId',
  'status',
  'lastMessageAt',
  'id',
])
@Check(
  'ck_chat_conversations_status',
  enumCheck('status', Object.values(ChatConversationStatus)),
)
export class ChatConversation extends UuidBaseEntity {
  @Column({ name: 'customer_id', type: 'uuid' })
  customerId: string;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: User;

  @Column({ name: 'assigned_admin_id', type: 'uuid', nullable: true })
  assignedAdminId: string | null;

  @ManyToOne(() => User, { onDelete: 'RESTRICT', nullable: true })
  @JoinColumn({ name: 'assigned_admin_id' })
  assignedAdmin: User | null;

  @Column({ type: 'varchar', length: 16, default: ChatConversationStatus.OPEN })
  status: ChatConversationStatus;

  @Column({ name: 'last_message_at', type: 'timestamptz', nullable: true })
  lastMessageAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
