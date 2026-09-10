/**
 * Xây biểu thức SQL `column IN ('A', 'B', ...)` cho @Check() decorator của TypeORM.
 * Dùng chung để tránh gõ tay danh sách giá trị enum lặp lại (dễ lệch với TS enum) — xem
 * CODING_STANDARD.md mục 15 (tái sử dụng) và mục 5 (extract cấu hình lặp lại).
 */
export function enumCheck(column: string, values: readonly string[]): string {
  return `${column} IN (${values.map((value) => `'${value}'`).join(', ')})`;
}
