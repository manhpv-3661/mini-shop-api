/**
 * Cột `email_notifications.event_type`. Xem docs/planning/database.md mục 4 —
 * "email_notifications".
 */
export enum EmailNotificationEventType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ORDER_PLACED = 'ORDER_PLACED',
  ORDER_CONFIRMED = 'ORDER_CONFIRMED',
  ORDER_REJECTED = 'ORDER_REJECTED',
  MONTHLY_REVENUE = 'MONTHLY_REVENUE',
}
