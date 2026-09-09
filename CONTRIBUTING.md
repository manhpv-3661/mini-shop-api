# Contributing

## Branch và commit

- Tạo branch từ `main`: `feature/pull-<n>-<slug>`, ví dụ `feature/pull-3-foundation`.
- Dùng Conventional Commits: `<type>: <description>` với `feat`, `fix`, `ci`, `docs`, `chore`, `test`, `refactor`.
- Không commit feature trực tiếp vào `main`.

## Trước khi gửi PR

1. Đối chiếu requirement ID và acceptance criteria của feature.
2. Self-review diff; xác nhận không có secret, file generated hoặc module tutorial thừa.
3. Chạy `npm run lint:sunlint` và lưu bằng chứng 0 error.
4. Chạy `npm run lint:check`, `npm run format:check`, `npm run build`, `npm run test:cov` và `npm run test:e2e`.
5. Nếu đổi entity, kiểm tra migration trên database mới và database test; chạy seed hai lần nếu PR có seed.
6. Cập nhật Swagger, tài liệu và test trong cùng PR sở hữu behavior.
7. Gửi mentor/teammate review và chỉ merge khi có approval.
