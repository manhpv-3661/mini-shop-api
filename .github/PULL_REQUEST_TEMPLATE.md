## Vấn đề và behavior sau thay đổi

Mô tả trigger cụ thể, behavior trước/sau và giá trị cho user/customer.

## Requirement

- Requirement/bug IDs:
- Acceptance criteria đã xử lý:
- Ngoài phạm vi PR:

## Thay đổi kỹ thuật

- API/module:
- Database/migration:
- Queue/file/integration:
- Security/RBAC/ownership:
- Performance/query:

## Kiểm chứng

```text
npm run lint:check
npm run format:check
npm run test:cov
npm run test:e2e
npm run build
npm run lint:sunlint
```

Ghi kết quả, test case quan trọng, migration run/revert/run và evidence cần thiết.

## Release và rủi ro

- Config/secret mới:
- Backward compatibility:
- Deploy/migration order:
- Rollback/forward-fix:
- Known limitations:

## Checklist

- [ ] PR có một mục đích review được và liên kết requirement.
- [ ] DTO validation, lỗi i18n, RBAC và ownership đã review.
- [ ] Entity đi cùng migration; `synchronize=false`.
- [ ] Unit/e2e phù hợp với rủi ro; test không chỉ lặp lại implementation.
- [ ] Swagger/tài liệu/runbook/release note được cập nhật.
- [ ] Không có secret, dữ liệu production hoặc log nhạy cảm.
- [ ] CI và Sunlint xanh; self-review hoàn tất.
