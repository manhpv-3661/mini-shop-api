# PR: Scaffold Mini Shop API foundation

## Problem and resulting behavior

Mini Shop cần một repository độc lập để triển khai Ecommerce API mà không kéo theo các domain Articles/Follows/Favorites/Comments từ tutorial. PR này tạo baseline NestJS 11 có thể chạy từ môi trường sạch, dùng chung bootstrap giữa production/e2e và sẵn sàng cho các PR schema/auth tiếp theo.

## Scope

- Config validation, TypeORM `synchronize=false`, migration runner dev/test.
- PostgreSQL, Redis và Mailpit qua Docker Compose.
- i18n en/vi, validation, exception envelope, Swagger và health endpoint.
- Redis lifecycle và dependencies tương thích cho Bull/Schedule/WebSocket.
- ESLint, Prettier, Jest, e2e, CI, VS Code tasks và coding conventions.
- Requirement, API contract, ERD, timeline, scope decision và delivery process.
- Utility core cho current user, bearer token, non-blank validation và PostgreSQL unique errors.

Không triển khai entity/auth/catalog/order trong PR foundation. Các phần này cần bám ERD/requirement đã được mentor review.

## Validation

- `npm run lint:check`: pass.
- `npm run format:check`: pass.
- `npm run test:cov -- --runInBand`: 19 tests pass; statements 87.8%, branches 75%, functions 89.47%, lines 86.48%.
- `npm run test:e2e`: 2 tests pass với PostgreSQL/Redis thật.
- `npm run build`: pass.
- `npm audit --audit-level=moderate`: 0 vulnerabilities.
- `npm run migration:run` và `npm run migration:run:test`: pass trên DB mới.
- `node dist/main`: boot thành công; `/api/v1/health` en/vi và `/api-docs` trả 200.

## Review focus

- Baseline chỉ chứa code core có thể tái sử dụng.
- Nest/Bull/Schedule/WebSocket versions tương thích Node 22/Jest hiện tại.
- `.env` local bị ignore; `.env.test` chỉ chứa credential local giả.
- CI và local dùng database test tách biệt.
- Full scope 130 giờ và yellow scope 80 giờ được phân biệt rõ.

## Next PR after merge

Tạo branch từ `main` đã merge foundation để triển khai `users`, `auth_tokens`, `email_notifications`, migration và auth flow theo requirement/ERD đã được mentor duyệt.
