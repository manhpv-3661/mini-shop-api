import { randomUUID } from 'crypto';
import { PrimaryColumn } from 'typeorm';

/**
 * Mọi bảng sinh UUID tại ứng dụng trước insert, không phụ thuộc extension UUID của Postgres
 * (xem docs/planning/database.md mục 2). Field initializer chạy khi TypeORM `repository.create()`
 * gọi `new Entity()`, nên `id` luôn có giá trị trừ khi bị ghi đè tường minh (vd khi load lại từ DB).
 */
export abstract class UuidBaseEntity {
  @PrimaryColumn('uuid')
  id: string = randomUUID();
}
