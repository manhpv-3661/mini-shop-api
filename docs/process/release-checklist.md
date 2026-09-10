# Release checklist

## Trước release

- [ ] Release scope và requirement IDs đã được PO xác nhận.
- [ ] CI xanh trên đúng commit/tag; không còn unresolved review comment.
- [ ] Unit, integration, e2e, regression và exploratory critical flow đã pass.
- [ ] Security/permission/upload/rate-limit review hoàn tất.
- [ ] Performance target và query plans quan trọng đạt yêu cầu.
- [ ] Migration đã chạy trên staging từ schema/version giống production.
- [ ] Backup gần nhất hợp lệ và restore rehearsal còn hiệu lực.
- [ ] Rollback/forward-fix plan có owner và trigger rõ.
- [ ] Config/secrets/feature flags được kiểm tra; không chứa giá trị local/test.
- [ ] Release note, known limitations, maintenance window và support owner đã gửi.

## Trong release

- [ ] Ghi thời điểm bắt đầu, operator, version trước/sau và change ticket.
- [ ] Chụp metric baseline trước deploy.
- [ ] Chạy migration theo runbook; lưu output đã lọc secret.
- [ ] Deploy artifact bất biến từ CI; không build lại thủ công trên server.
- [ ] Smoke health, auth, catalog, checkout, order và async mail.
- [ ] Theo dõi error rate, latency, DB, Redis, queue và scheduler.
- [ ] PO/customer đại diện xác nhận business smoke.

## Sau release

- [ ] Ghi kết quả release, metric và mọi deviation.
- [ ] Tag/version và release notes trỏ đúng commit.
- [ ] Xác nhận mọi cảnh báo đã được xử lý hoặc kích hoạt rollback/forward fix đúng trigger.
- [ ] Theo dõi tăng cường trong cửa sổ đã thống nhất.
- [ ] Cập nhật status page/stakeholder và bàn giao support.
- [ ] Tạo incident/postmortem/action item nếu có sự cố hoặc near miss.
