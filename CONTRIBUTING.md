# Contributing

## Branch và commit

- Tạo branch từ `main`: `feature/pull-<n>-<slug>`, ví dụ `feature/pull-3-foundation`.
- Dùng Conventional Commits: `<type>: <description>` với `feat`, `fix`, `ci`, `docs`, `chore`, `test`, `refactor`.
- Commit message KHÔNG kèm trailer `Co-Authored-By` của AI assistant (Claude/Copilot/...) — tác giả commit chỉ là người thật đứng tên PR.
- Không commit feature trực tiếp vào `main`.
- Chỉ tạo branch feature mới từ `main` sau khi PR nền mà feature phụ thuộc đã merge. Nếu làm stacked PR, ghi rõ base branch và rebase về `main` sau khi dependency merge.

## Trước khi gửi PR

1. Đối chiếu requirement ID và acceptance criteria của feature.
2. Self-review diff; xác nhận không có secret, file generated hoặc module tutorial thừa. Chạy skill `/pr-self-review` (xem [docs/process/pr-self-review-checklist.md](./docs/process/pr-self-review-checklist.md)) để soát theo đúng pattern reviewer thật hay bắt lỗi.
3. Chạy `npm run lint:sunlint` và lưu bằng chứng 0 error.
4. Chạy `npm run lint:check`, `npm run format:check`, `npm run build`, `npm run test:cov` và `npm run test:e2e`.
5. Nếu đổi entity, kiểm tra migration trên database mới và database test; chạy seed hai lần nếu PR có seed.
6. Cập nhật Swagger, tài liệu và test trong cùng PR sở hữu behavior.
7. Gửi mentor/teammate review và chỉ merge khi có approval.

Dùng [.github/PULL_REQUEST_TEMPLATE.md](./.github/PULL_REQUEST_TEMPLATE.md) cho mọi PR. `main` trên remote phải bật branch protection: required CI, ít nhất một approval, dismiss stale approvals và chặn force-push/delete.
