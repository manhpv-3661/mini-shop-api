/**
 * Cột `users.status`. Registration luôn tạo PENDING; verify email chuyển PENDING → ACTIVE.
 * Xem docs/planning/database.md mục 4 — "users".
 */
export enum UserStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
