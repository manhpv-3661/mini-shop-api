/**
 * Cột `product_suggestions.status`. Workflow PENDING → APPROVED|REJECTED.
 * Xem docs/planning/database.md mục 4 — "product_suggestions".
 */
export enum ProductSuggestionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}
