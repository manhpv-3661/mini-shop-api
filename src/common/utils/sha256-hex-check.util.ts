/**
 * Xây biểu thức SQL kiểm tra một cột char(64)/varchar(64) đúng là chuỗi hex lowercase 64 ký tự
 * (SHA-256 digest) cho @Check() decorator của TypeORM — dùng chung cho mọi cột lưu hash dạng này
 * (vd `orders.request_hash`) thay vì viết lại regex ở từng entity.
 */
export function sha256HexCheck(column: string): string {
  return `${column} ~ '^[0-9a-f]{64}$'`;
}
