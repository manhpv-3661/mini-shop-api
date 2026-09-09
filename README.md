# Mini Shop API

NestJS backend cho Mock Project Ecommerce. Project này được khởi tạo riêng từ `nestjs-tutorial`: tái sử dụng các pattern nền đã học và không mang theo domain Articles/Follows/Favorites/Comments.

## Trạng thái hiện tại

Foundation đã có:

- NestJS 11, TypeScript strict và cấu trúc module theo domain.
- Joi env validation; PostgreSQL 16 + TypeORM với `synchronize=false`.
- i18n `en/vi`, global validation pipe, serializer và exception envelope.
- Redis lifecycle, package Bull, scheduler và WebSocket tương thích với NestJS 11.
- Swagger, migration CLI, unit/e2e setup, CI và Docker Compose.
- PostgreSQL dev/test, Redis và Mailpit local.

Feature nghiệp vụ chưa được đánh dấu hoàn thành. Thứ tự tiếp theo là review requirement/ERD, tạo schema 14 bảng, rồi làm các tính năng màu vàng trước.

## Chạy local

Yêu cầu Node.js 22+, npm và Docker.

```powershell
npm install
docker compose up -d
npm run migration:run
npm run start:dev
```

- Health: `http://localhost:3001/api/v1/health`
- Swagger: `http://localhost:3001/api-docs`
- Mailpit: `http://localhost:8026`

`.env` local đã được tạo và bị Git ignore. Khi setup máy khác, copy `.env.example` thành `.env`; không commit secret thật.

## Kiểm tra

```powershell
npm run lint:check
npm run format:check
npm run test:cov
npm run test:e2e
npm run build
```

E2E dùng database `mini_shop_test` trong `.env.test`, không dùng database dev. Docker tạo database này ở lần khởi tạo volume đầu tiên.

## Migration

```powershell
npm run migration:create -- src/database/migrations/CreateShopSchema
npm run migration:run
npm run migration:revert
npm run migration:run:test
```

Mỗi PR thay entity phải có migration tương ứng. Không bật `synchronize`, không sửa migration đã chạy ở môi trường chung và không đưa seed data vào migration schema.

## Tài liệu dự án

- [Kế hoạch full scope](./docs/planning/full-scope-plan.md)
- [Ma trận 27 chức năng](./docs/planning/scope-matrix.csv)
- [API requirements](./docs/planning/api-requirements.csv)
- [API contract](./docs/planning/api-contract.md)
- [Database design](./docs/planning/database.md)
- [ERD draw.io](./docs/planning/ecommerce.drawio)
- [Timeline 130 giờ](./docs/planning/timeline-full-scope.csv)

Các dòng vàng là bắt buộc. Dòng trắng có độ ưu tiên thấp hơn nhưng vẫn nằm trong full scope 130 giờ. Mốc 80 giờ chỉ cam kết scope vàng cùng các yêu cầu chất lượng bắt buộc.

## Phần đã lấy từ tutorial

Đã tái sử dụng và đổi tên/cấu hình theo Mini Shop:

- bootstrap production/e2e dùng chung;
- exception filter và response error envelope;
- Joi config, TypeORM DataSource và migration scripts;
- i18n assets/parity test;
- Redis module và shutdown lifecycle;
- ESLint, Prettier, Jest, CI và coding conventions.

Không copy entity/migration/module của Articles, Follows, Favorites, Comments và Profiles. Auth/Users chỉ được đưa sang khi đã sửa theo role `CUSTOMER|ADMIN`, status `PENDING|ACTIVE|INACTIVE`, email activation, token một lần và schema Mini Shop.
