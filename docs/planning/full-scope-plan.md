# Kế hoạch full scope — toàn bộ tab `4.Ecommerce`

Tài liệu này sửa cách ước lượng trước đó. Tab nguồn có **27 dòng chức năng**: 21 Basic và 6 Advance. Có 15 dòng tô vàng và 12 dòng nền trắng. Sheet không có legend nói rõ màu trắng là optional; vì mục tiêu hiện tại là “làm hết”, cả 27 dòng đều là phạm vi phải bàn giao. Chi tiết từng dòng, màu và effort nằm trong [scope-matrix.csv](./scope-matrix.csv).

## Kết luận về 80 giờ

| Phương án                   | Phạm vi                                           |      Effort | Số ngày ở 5,2 giờ/ngày | Kết luận                                 |
| --------------------------- | ------------------------------------------------- | ----------: | ---------------------: | ---------------------------------------- |
| Yellow scope                | 15 dòng vàng + nền tảng/chất lượng bắt buộc       |      74 giờ |                15 ngày | Vừa 80 giờ và còn khoảng 6 giờ dự phòng  |
| All Basic                   | 21 dòng Basic + nền tảng/chất lượng               |      98 giờ |                19 ngày | Thiếu 18 giờ nếu chỉ có 80 giờ           |
| Full sheet                  | 21 Basic + 6 Advance + nền tảng/chất lượng        | **130 giờ** |            **25 ngày** | Phương án nên dùng nếu muốn làm hết      |
| Full sheet + online payment | Full sheet và một cổng thanh toán sandbox/webhook |     145 giờ |                28 ngày | Chỉ dùng khi mentor yêu cầu gateway thật |

`130 / 5,2 = 25` ngày làm việc. Nếu bắt đầu 09/09/2026 và nghỉ thứ Bảy, Chủ nhật thì ngày thứ 25 là 13/10/2026. [timeline-full-scope.csv](./timeline-full-scope.csv) là lịch triển khai đầy đủ.

Ước lượng 130 giờ đã gồm code, test của feature, review, sửa lỗi và tài liệu. Không cộng riêng những việc này lần nữa. Payment trong mốc 130 giờ là **COD** vì sheet chưa chỉ định nhà cung cấp, webhook, refund hay đối soát. Nếu mentor xác nhận online payment, lập change request và dùng mốc 145 giờ.

## Ranh giới để 130 giờ khả thi

- Mỗi product có một category, một ảnh, không có biến thể, coupon, phí vận chuyển hay nhiều kho.
- Share social trả canonical URL và link chia sẻ Facebook/X; không đăng bài thay user và không dùng OAuth mạng xã hội.
- Mỗi customer có tối đa một conversation OPEN với support. Chat gồm lịch sử qua REST và tin nhắn realtime qua WebSocket; không có file, typing indicator, presence hay push notification.
- Product suggestion là workflow `PENDING → APPROVED|REJECTED`; admin có thể ghi lý do. Approve không tự tạo product vì còn cần SKU, giá, tồn và ảnh.
- Best-selling tính tổng quantity của order `COMPLETED`. Revenue chỉ tính `COMPLETED`, nhóm theo tháng hoặc năm theo múi giờ `Asia/Bangkok`.
- Job báo cáo chạy 00:10 ngày đầu tháng và báo cáo tháng vừa kết thúc. Unique theo recipient + report period ngăn tạo hai email intent.
- Dữ liệu demo và kiểm thử chạy trên PostgreSQL thật; Redis/Mailpit dùng môi trường local/test. Không gửi mail cho địa chỉ thật.

## Đối chiếu đủ 27 chức năng

### Guest — 4/4

- [x] Đăng ký tài khoản.
- [x] Xem sản phẩm nổi bật.
- [x] Danh sách, tìm kiếm theo từ khóa, category và khoảng giá.
- [x] Chi tiết sản phẩm.

### User Basic — 9/9

- [x] Đăng nhập/đăng xuất.
- [x] Xem/sửa profile và đổi mật khẩu.
- [x] Thêm/sửa/xóa item trong giỏ.
- [x] Xem giỏ.
- [x] Checkout và thanh toán COD.
- [x] Xem lịch sử đơn.
- [x] Xem chi tiết và trạng thái đơn.
- [x] Hủy khi đơn còn `PENDING`.
- [x] Bình luận một cấp và đánh giá 1–5 sao sau khi mua thành công.

### User Advance — 3/3

- [x] Lấy link chia sẻ sản phẩm qua Facebook/X.
- [x] Chat realtime với admin và xem lại lịch sử.
- [x] Gửi gợi ý sản phẩm mới cho admin.

### Admin Basic — 4/4

- [x] List/detail và active/inactive user.
- [x] CRUD category.
- [x] CRUD product và xử lý ảnh.
- [x] List/detail và chuyển trạng thái order; reject bắt buộc có lý do.

### Admin Advance — 2/2

- [x] List/detail và approve/reject product suggestion.
- [x] Xem sản phẩm bán chạy và doanh thu theo tháng/năm.

### System Basic và Advance — 5/5

- [x] Mail kích hoạt tài khoản.
- [x] Mail quên/reset mật khẩu.
- [x] Mail khi admin confirm/reject order.
- [x] Mail khi đặt hàng thành công.
- [x] Mail báo cáo doanh thu tháng cho admin.

Các dấu `[x]` ở đây nghĩa là **đã đưa vào phạm vi/requirement**, chưa có nghĩa feature đã được code xong.

## Phân bổ 130 giờ

| Nhóm                     |     Giờ | Đầu ra chính                                                                                     |
| ------------------------ | ------: | ------------------------------------------------------------------------------------------------ |
| Guest catalog + register |      12 | Register, featured, search/filter, detail                                                        |
| User Basic               |      41 | Auth/profile, cart, checkout COD, orders, review                                                 |
| User Advance             |      17 | Share link, chat, product suggestion                                                             |
| Admin Basic              |      20 | User, category, product, order management                                                        |
| Admin Advance            |      11 | Suggestion workflow, best-seller/revenue                                                         |
| System mail/schedule     |      17 | 4 mail Basic và monthly report                                                                   |
| Cross-cutting            |      12 | Requirement/ERD gap, i18n, migration, RBAC, seed, CI, e2e, performance, debug, Swagger, handover |
| **Tổng**                 | **130** | **Full sheet**                                                                                   |

Các dòng trong [scope-matrix.csv](./scope-matrix.csv) chia 118 giờ theo feature. 12 giờ cross-cutting chỉ cộng một lần ở bảng trên.

## Database full scope

Full scope dùng **14 bảng**. Mười một bảng core giữ nguyên: `users`, `auth_tokens`, `attachments`, `categories`, `products`, `reviews`, `cart_items`, `orders`, `order_items`, `order_status_history`, `email_notifications`. Ba bảng Advance được thêm:

1. `chat_conversations`: customer, admin được assign, status, thời điểm tin nhắn cuối; partial unique bảo đảm mỗi customer chỉ có một conversation OPEN.
2. `chat_messages`: conversation, sender, body, read time, created time; sort ổn định bằng `(conversation_id, created_at, id)`.
3. `product_suggestions`: customer gửi, nội dung gợi ý, trạng thái, admin review, lý do và timestamps.

`email_notifications` thêm `report_period date NULL` và event `MONTHLY_REVENUE`. Event auth có `auth_token_id`; event order có `order_id`; event report có `report_period`. Ba loại context loại trừ nhau bằng CHECK. Social share và thống kê là dữ liệu tính từ bảng hiện có nên không tạo bảng riêng.

Xem schema, constraints, indexes và transaction rules trong [database.md](./database.md), rồi mở [ecommerce.drawio](./ecommerce.drawio) để review quan hệ bằng draw.io.

## Lộ trình PR

| PR kế hoạch | Branch gợi ý              | Nội dung                                              | Bằng chứng review                                   |
| ----------- | ------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| 01          | `docs/full-requirements`  | Đủ 27 chức năng, API contract, assumptions, estimates | Mapping 27/27; mentor trả lời câu hỏi scope         |
| 02          | `docs/full-erd`           | ERD 14 bảng, constraints, indexes, transactions       | Self-review checklist; mentor review ERD            |
| 03          | `feat/foundation`         | Init, config, i18n, Swagger, Docker Compose, CI       | App/DB/Redis/Mailpit boot; config fail-fast         |
| 04          | `feat/schema-seed`        | Entities, migrations, seed CLI                        | DB rỗng run migration; seed hai lần không duplicate |
| 05          | `feat/mail-queue`         | Notification outbox, Bull/Redis, SMTP, dispatcher     | Redis down không mất intent; retry có giới hạn      |
| 06          | `feat/auth`               | Register, activation, login/logout, guards            | Unit + e2e auth; PENDING không login                |
| 07          | `feat/account-recovery`   | Forgot/reset, profile, đổi password                   | Token dùng một lần; token cũ bị revoke              |
| 08          | `feat/admin-users`        | List/detail/active/inactive user                      | RBAC; deactivated token bị chặn request sau         |
| 09          | `feat/catalog-files`      | Category/product/public search/featured/file          | Filter/index; rollback upload giữ ảnh cũ            |
| 10          | `feat/reviews`            | Review/rating một cấp                                 | Verified purchase; unique user/product              |
| 11          | `feat/cart`               | Get/set/delete cart items                             | Ownership; giới hạn 20 dòng; concurrent update      |
| 12          | `feat/checkout`           | COD checkout, snapshot, stock locks, idempotency      | Stock=1 concurrent e2e; rollback atomic             |
| 13          | `feat/orders`             | Customer/admin orders, state machine, emails          | Cancel/confirm race; hoàn tồn đúng một lần          |
| 14          | `feat/share-suggestions`  | Social links và suggestion workflow                   | Không open redirect; ownership/RBAC/status tests    |
| 15          | `feat/support-chat`       | Conversation, REST history, WebSocket chat            | Auth handshake; owner/admin room isolation          |
| 16          | `feat/analytics-report`   | Best-seller, revenue, monthly report mail             | COMPLETED-only queries; timezone/idempotency tests  |
| 17          | `chore/release-hardening` | Full e2e, query plans, debug fixes, docs, demo        | Clean-clone rehearsal; CI xanh; known limitations   |

Không cần chờ một PR lớn mới review. Mỗi PR chứa migration đi cùng entity/feature của nó; Swagger và test được cập nhật trong cùng PR sở hữu behavior.

## Definition of Done cho từng feature

Một feature chỉ được đánh dấu Done khi đủ các điều sau:

1. Requirement và acceptance criteria đã chốt; edge cases quan trọng có test.
2. DTO từ chối field lạ, validate cận và trả error code/message i18n thống nhất.
3. RBAC và ownership chạy trong query/service; response không lộ password, token, email không cần thiết hoặc internal fields.
4. Entity, migration, constraint và index khớp ERD; `synchronize=false`.
5. Transaction/locking được dùng ở checkout, cancel/reject và các luồng nhiều bản ghi.
6. Unit test cho business branch; e2e trên PostgreSQL thật cho auth, ownership, transaction, concurrency, queue/schedule và WebSocket.
7. Swagger có request/response/error; log có correlation ID và không chứa secret.
8. PR self-review xong, CI xanh và feedback mentor được xử lý hoặc ghi rõ thành task tiếp theo.

## Nếu vẫn bị giữ deadline 80 giờ

Đưa mentor hai lựa chọn có số liệu:

- Giữ 80 giờ: hoàn thành 15 dòng vàng, các kỹ thuật bắt buộc và 6 giờ buffer; các dòng trắng/Advance chuyển backlog.
- Giữ toàn bộ 27 dòng: đổi estimate thành 130 giờ/25 ngày làm việc.

Không nên nhận “80 giờ và làm hết” mà không ghi rủi ro. Kết quả thường là có nhiều endpoint nhưng thiếu transaction, authorization, e2e, migration an toàn và khả năng chạy lại từ môi trường sạch; như vậy chưa đạt yêu cầu học theo dự án thật.
