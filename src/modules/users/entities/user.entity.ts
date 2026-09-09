import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UuidBaseEntity } from '../../../common/entities/uuid-base.entity';
import { enumCheck } from '../../../common/utils/enum-check.util';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Danh tính và quyền. Registration luôn tạo CUSTOMER/PENDING; verify email chuyển PENDING → ACTIVE.
 * Admin chỉ đổi ACTIVE ↔ INACTIVE, không đổi role và không tự deactivate (rule ở service, không ở DB).
 * Xem docs/planning/database.md mục 4 — "users".
 */
@Entity({ name: 'users' })
@Unique('uq_users_email', ['email'])
@Unique('uq_users_username', ['username'])
@Index('idx_users_status_created_id', ['status', 'createdAt', 'id'])
@Check('ck_users_email_normalized', `email = lower(btrim(email))`)
@Check('ck_users_username_normalized', `username = lower(btrim(username))`)
@Check('ck_users_token_version_nonnegative', `token_version >= 0`)
@Check('ck_users_role', enumCheck('role', Object.values(UserRole)))
@Check('ck_users_status', enumCheck('status', Object.values(UserStatus)))
export class User extends UuidBaseEntity {
  @Column({ type: 'varchar', length: 254 })
  email: string;

  @Column({ type: 'varchar', length: 30 })
  username: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 16, default: UserRole.CUSTOMER })
  role: UserRole;

  @Column({ type: 'varchar', length: 24, default: UserStatus.PENDING })
  status: UserStatus;

  @Column({ name: 'email_verified_at', type: 'timestamptz', nullable: true })
  emailVerifiedAt: Date | null;

  @Column({ name: 'token_version', type: 'int', default: 0 })
  tokenVersion: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
