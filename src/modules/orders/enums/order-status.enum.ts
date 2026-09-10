/**
 * Cột `orders.status`, dùng lại ở `order_status_history.from_status`/`to_status` (cùng vòng đời,
 * không định nghĩa trùng). Xem docs/planning/database.md mục 4 — "orders".
 */
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}
