/**
 * Cột `email_notifications.status` — vòng đời gửi outbox. Xem docs/planning/database.md
 * mục 4 — "email_notifications".
 */
export enum EmailNotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
}
