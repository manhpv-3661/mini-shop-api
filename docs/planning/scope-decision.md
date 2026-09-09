# Scope decision log

## 09/09/2026 — màu trong tab Ecommerce

Trao đổi với người phụ trách Mock Project xác nhận:

- Dòng màu vàng là chức năng chính bắt buộc.
- Dòng màu trắng có độ ưu tiên thấp hơn và có thể thực hiện sau.

Quyết định lập kế hoạch:

- `P0`: 15 chức năng màu vàng và các yêu cầu kỹ thuật bắt buộc.
- `P1`: các chức năng Basic nền trắng.
- `P2`: các chức năng Advance nền trắng.
- Mục tiêu cá nhân vẫn là full scope 27/27 trong 130 giờ; nếu allocation chỉ giữ 80 giờ thì cam kết nghiệm thu P0 trước.

Màu chỉ quyết định thứ tự ưu tiên. Mỗi feature chỉ được đánh dấu Done khi code, migration, authorization, test và Swagger liên quan đều hoàn tất.

## 09/09/2026 — dời "login mẫu" khỏi PR foundation (B3), sang PR06 `feat/auth`

Hướng dẫn quy trình gốc mô tả B3 là "dùng code tutorial để triển khai nhanh api login" ngay trong bước cùng với init project/i18n/migrate cơ bản. PR foundation (`feature/pull-3-foundation`) hiện tại **chưa** làm phần login: chỉ có dependency (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`, `bcrypt`) và vài utility rỗng (`extract-bearer-token.util.ts`, `authenticated-user.interface.ts`, `current-user.decorator.ts`), chưa có `AuthModule`/`AuthController`/endpoint `/login` nào.

Lý do dời: entity `users` (role `CUSTOMER|ADMIN`, status `PENDING|ACTIVE|INACTIVE`, email activation, token một lần) chưa tồn tại ở bước foundation — implement login trước khi có schema thật sẽ phải viết lại ở PR04/PR06. Quyết định: gộp toàn bộ auth (register, activation, login/logout, guards) vào PR06 `feat/auth`, sau PR04 `feat/schema-seed` (entities/migration) và PR05 `feat/mail-queue` (cần cho email activation). **Điểm này lệch với thứ tự B3→B4 mà mentor mô tả — cần xác nhận lại với mentor** khi gửi requirement + ERD review, không tự coi là đã duyệt.

## 09/09/2026 — chốt lịch làm việc thật: bắt đầu 07/09/2026, ngân sách 80 giờ, chỉ cam kết P0 (15 dòng vàng)

Xác nhận capacity thật: 0,65/1,0 effort mỗi ngày ≈ 5,2 giờ/ngày (khớp con số đã dùng xuyên suốt các tài liệu khác), nghỉ thứ Bảy/Chủ nhật. Ngân sách hiện tại là **80 giờ**, không phải 130 giờ — quay lại đúng phương án "Yellow scope" đã nêu trong [full-scope-plan.md](./full-scope-plan.md) (74 giờ nội dung + 6 giờ dự phòng). Ngày bắt đầu thực tế là **07/09/2026** (không phải 09/09/2026 như các mốc tính trước đó trong `scope-decision.md`/`timeline-full-scope.csv` — hai file đó vẫn giữ nguyên cho phương án full scope 130 giờ nếu sau này mở rộng lại).

80 giờ ở 5,2 giờ/ngày = 80/5,2 ≈ 15,4 → **16 ngày làm việc**, từ Thứ Hai 07/09/2026 đến Thứ Hai 28/09/2026 (bỏ qua 2 cuối tuần ở giữa). Lịch chi tiết theo từng ngày và PR nằm trong [timeline-yellow-80h.csv](./timeline-yellow-80h.csv).

Phạm vi cam kết trong 80 giờ này là **đúng 15 chức năng màu vàng** trong [scope-matrix.csv](./scope-matrix.csv) (62 giờ feature) cộng phần nền tảng/hạ tầng bắt buộc không có trong 27 dòng sheet gốc — schema/migration/seed CLI, RBAC guard dùng chung, notification outbox/Bull/SMTP/scheduler (12 giờ) — tổng 74 giờ, còn 6 giờ dự phòng cuối cho hồi quy/demo. Các PR cần làm theo đúng thứ tự: `feature/pull-4-schema-seed` → `feature/pull-5-mail-queue` → `feature/pull-6-auth` → `feature/pull-9-catalog-files` → `feature/pull-11-cart` → `feature/pull-12-checkout` → `feature/pull-13-orders`.

**Rõ ràng bị lùi lại (không nằm trong 80 giờ này), thuộc backlog P1/P2 chờ ngân sách tiếp theo:**

- P1 (Basic nền trắng, 12 dòng ở scope-matrix.csv): xem/sửa hồ sơ cá nhân + đổi mật khẩu (PR07), bình luận/đánh giá sản phẩm (PR10), quản lý người dùng — admin (PR08), quản lý danh mục CRUD — admin (PR09 phần category), mail kích hoạt tài khoản và mail quên mật khẩu dưới dạng feature hoàn chỉnh (hạ tầng gửi mail vẫn có sẵn từ PR05, chỉ chưa polish riêng cho 2 luồng này).
- P2 (toàn bộ Advance, 6 dòng): chia sẻ sản phẩm qua Facebook/X, chat với admin, gợi ý sản phẩm mới, quản lý gợi ý sản phẩm (admin), thống kê bán chạy/doanh thu, mail báo cáo doanh thu cuối tháng.

Theo đúng khuyến nghị ở mục "Nếu vẫn bị giữ deadline 80 giờ" của `full-scope-plan.md`: đây là lựa chọn có ghi rủi ro rõ ràng, không phải "nhận 80 giờ và làm hết". Danh sách backlog trên phải được báo lại cho mentor cùng lúc gửi requirement/ERD review, không tự quyết định cắt giảm mà không thông báo.
