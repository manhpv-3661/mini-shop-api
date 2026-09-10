# Checklist tự review trước khi mở PR — rút từ pattern reviewer thật

Tài liệu này khác [CODING_STANDARD.md](../../CODING_STANDARD.md) ở chỗ: thay vì suy luận lý thuyết, các mục 🔴 dưới đây được rút trực tiếp từ **comment review thật** trên các Pull Request công khai của các học viên khác cùng chương trình training NestJS mock project, tất cả đều do **cùng một reviewer (`lamnv-1116`)** chấm:

- https://github.com/thaind-2785/nestjs-mock-project/pull/7
- https://github.com/thaind-2785/nestjs-mock-project/pull/8
- https://github.com/thanhnn-3239/realworld-tutorial/pull/21
- https://github.com/thanhdn-2601/nestjs_tutorial/pull/3
- https://github.com/thanhnn-3239/realworld-tutorial/pull/22 (upload avatar qua object storage — bổ sung 10/09/2026)
- https://github.com/yenvt-0228/store-web/pull/10 (publish order event qua Kafka — bổ sung 10/09/2026)

Vì cùng một người review cả 6 PR, những gì lặp lại nhiều lần ở đây gần như chắc chắn sẽ lặp lại khi PR của chính dự án Mini Shop được gửi đi — đây không phải checklist "chuẩn chung chung", mà là hồ sơ hành vi thật của một reviewer cụ thể. Bảng tần suất bên dưới ("Top pattern lặp lại nhiều nhất") vẫn giữ nguyên số liệu gốc trên 4 PR đầu (TypeORM/Postgres) để không bịa tần suất; 2 PR bổ sung dùng stack khác hẳn (Prisma thay TypeORM, Kafka event bus thay vì chỉ REST) nên được dùng làm **bằng chứng chéo stack** — pattern nào lặp lại ở cả 2 PR mới xác nhận đây là thói quen review ổn định của `lamnv-1116`, không phải đặc thù riêng TypeORM/NestJS, và được thêm thành mục riêng ở phần "Bổ sung sau khi đối chiếu 2 PR khác stack" bên dưới thay vì gộp vào bảng tần suất gốc.

## Phong cách reviewer (để đọc hiểu đúng comment khi nhận được)

- Viết 100% tiếng Việt, xưng "anh — em", câu ngắn, kết thúc bằng "e nhé"/"e nhe"; gõ nhanh nên có lỗi chính tả (cosnt, funticon, filed, loigc...) — **không phải comment hời hợt**, chỉ là ưu tiên tốc độ phản hồi.
- Hầu hết comment nêu đúng vấn đề trong 1 câu, **không giải thích "vì sao"** — trừ các vấn đề về transaction/data consistency thì có giải thích hệ quả rõ ràng. Không dùng nhãn mức độ nghiêm trọng (blocking/nitpick) theo kiểu [Conventional Comments](https://conventionalcomments.org/).
- Duyệt dựa trên tin tưởng: tác giả sửa xong đẩy 1 commit là approve gần như ngay, không soát lại toàn bộ diff — nghĩa là **tự chịu trách nhiệm sửa đúng và đủ trước khi push lại**, đừng trông chờ reviewer bắt tiếp nếu sửa thiếu.
- Trọng tâm gần như tuyệt đối vào **tối ưu truy vấn database** và **tổ chức code**; hầu như không đả động tới test coverage, security, hay commit convention — điều đó không có nghĩa các mảng này không quan trọng, chỉ là quy trình review hiện tại chưa phủ tới (xem mục 🟡 bên dưới để tự bù đắp).

## Top pattern lặp lại nhiều nhất (tần suất trên 4 PR)

| #   | Pattern                                                                                                              | Tần suất | Đã có rule trong CODING_STANDARD.md?                                     |
| --- | -------------------------------------------------------------------------------------------------------------------- | :------: | ------------------------------------------------------------------------ |
| 1   | Query trong vòng lặp (N+1); dùng `findOne()` để check tồn tại thay vì `exists()`; nên `IN(...)`/`JOIN`/`Promise.all` |  3/4 PR  | ✅ mục 18.2, 18.5, 18.6                                                  |
| 2   | Thiếu `.select([...])` giới hạn cột khi query/join — kéo dư dữ liệu                                                  |  3/4 PR  | ⚠️ chưa có rule riêng — bổ sung ở mục Database bên dưới                  |
| 3   | Interface khai trong file service thay vì tách file riêng                                                            |  3/4 PR  | ✅ mục 4 (Type Extraction)                                               |
| 4   | Magic number/regex/path rải rác, chưa gom vào 1 file constants dùng chung                                            |  3/4 PR  | ⚠️ mục 12 chỉ có convention đặt tên, chưa nhấn mạnh "gom 1 nơi"          |
| 5   | Hàm quá dài/nhiều if-else lồng nhau; code trùng lặp chưa rút hàm chung                                               |  3/4 PR  | ⚠️ mục 5 gần giống nhưng chỉ nói về config, không nói về độ dài hàm      |
| 6   | Controller chứa business logic                                                                                       |  2/4 PR  | ✅ mục 3                                                                 |
| 7   | Thiếu transaction/chưa xử lý concurrency; ghi file trước khi transaction DB chạy                                     |  2/4 PR  | ✅ mục 6, 18.7                                                           |
| 8   | Access modifier (private/public) không nhất quán                                                                     |  2/4 PR  | ⚠️ chưa có rule riêng                                                    |
| 9   | Tên hàm/biến không rõ nghĩa; repository không theo convention CRUD                                                   |  1/4 PR  | ✅ mục 12 (naming)                                                       |
| 10  | Thiếu logger cho xử lý quan trọng                                                                                    |  1/4 PR  | ✅ mục 17.5 (nhưng chỉ nói về log framework, chưa nói "chỗ nào cần log") |

**Kết luận quan trọng:** phần lớn (6/10) pattern reviewer thật hay bắt đã được `CODING_STANDARD.md` phủ sẵn — đây là bằng chứng độc lập từ ngoài dự án xác nhận các rule đó không phải lý thuyết suông. 4 khoảng trống còn lại (⚠️) được bổ sung thành rule cụ thể ngay dưới đây.

## Checklist — chạy trước khi mở PR

Mục có 🔴 lấy trực tiếp từ 4 PR thật ở trên; mục có 🟡 là khoảng trống bổ sung từ chuẩn ngành ([Google eng-practices](https://google.github.io/eng-practices/review/reviewer/standard.html), [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html), [12-Factor App](https://12factor.net/config)) mà 4 PR chưa từng chạm tới nhưng vẫn quan trọng cho Mini Shop.

### Database & Performance

- [ ] 🔴 Không có query nào chạy bên trong vòng lặp `for`/`.map()` — đã gộp bằng `WHERE ... IN (...)`, `JOIN`, hoặc `Promise.all`/`Promise.allSettled` khi các tác vụ độc lập (CODING_STANDARD mục 18.2, 18.6).
- [ ] 🔴 Check tồn tại dùng `repository.exists()`, không `findOne()` (CODING_STANDARD mục 18.5).
- [ ] 🔴 **Mọi query join nhiều bảng hoặc list nhiều cột đều có `.select([...])` chỉ định rõ field cần dùng** — đây là pattern reviewer nhắc nhiều nhất mà project chưa có rule riêng.
- [ ] 🔴 Tạo entity qua transaction manager dùng `manager.create(Entity, {...})` rồi mới `insert()`/`save()`, không insert object literal thô.
- [ ] 🔴 Thao tác ghi nhiều bước (update token, ghi file rồi update DB...) đã bọc transaction đúng cách truyền `manager` xuyên suốt (CODING_STANDARD mục 6); đã cân nhắc race condition khi nhiều request đồng thời.
- [ ] 🔴 Nếu ghi file ra ngoài DB (avatar, ảnh sản phẩm) trước khi transaction DB chạy — đã xử lý dọn file mồ côi khi transaction lỗi (CODING_STANDARD mục 6, "Lưu ý theo mentor").
- [ ] Thao tác "đọc rồi ghi lại" trên 1 row có thể bị nhiều request chạm cùng lúc (trừ tồn kho, đổi trạng thái đơn, mở conversation) dùng atomic UPDATE có điều kiện hoặc `pessimistic_write` lock, không chỉ bọc transaction rồi coi là đủ — **không có trong 4 PR đã phân tích vì chưa PR nào tới checkout/concurrency, nhưng là rủi ro đúng nhất cho PR12 sắp tới** (CODING_STANDARD mục 22).

### Code Structure

- [ ] 🔴 Interface dùng trong service/controller đã tách ra `interfaces/*.interface.ts`, không khai trực tiếp trong file logic chính (CODING_STANDARD mục 4). **Kể cả khi có lý do kỹ thuật hợp lý để khai inline (vd tránh import cycle giữa 2 service) — reviewer vẫn không chấp nhận, kể cả khi code đã có comment giải thích rõ lý do; yêu cầu là tách file riêng và giải quyết cycle bằng cách khác (đặt interface ở vị trí trung lập hơn trong dependency graph), không né rule bằng cách khai inline** (nguồn: PR thanhnn-3239/realworld-tutorial#22 — `AvatarReplacementRow` khai trong service kèm comment giải thích cycle, reviewer vẫn yêu cầu tách file và còn nhắc thêm "nếu dùng AI flow thì nên update skill/prompt để nó luôn tách file interface").
- [ ] 🔴 **Magic number/regex/path cố định đã gom vào `constants/` của đúng module sở hữu** (không rải rác từng DTO/service) — pattern reviewer nhắc 3/4 PR.
- [ ] 🔴 **Không có hàm nào quá dài hoặc if/else lồng quá 3 cấp; logic lặp lại giữa 2+ hàm đã rút thành hàm dùng chung** — nếu thấy mình đang copy-paste, dừng lại và tách hàm.
- [ ] 🔴 Controller không chứa business logic, chỉ gọi service (CODING_STANDARD mục 3).
- [ ] 🔴 **Access modifier (`private`/`public`) đã rà soát nhất quán** — method chỉ dùng nội bộ class phải `private`; áp dụng đồng bộ cho các hàm cùng vai trò trong file.
- [ ] Tên hàm/biến rõ nghĩa nghiệp vụ; method repository theo đúng convention CRUD (CODING_STANDARD mục 12).
- [ ] Enum/type mới không mặc định đặt trong entity/service của module sở hữu dữ liệu — đã tự hỏi module khác không liên quan trực tiếp có cần dùng giá trị này ở runtime không (vd `UserRole` cho RBAC ở mọi module); nếu có, đặt ở `common/enums/` (CODING_STANDARD mục 10).
- [ ] 🔴 **Enum không cross-module vẫn phải tách file riêng `enums/<ten>.enum.ts`, không khai `export enum` ngay trong file entity** — kể cả khi chỉ dùng trong 1 module, cùng lý do với việc tách interface (mục 4). Đây từng là bug thật trong repo: 6/7 enum (`AuthTokenType`, `UserStatus`, `OrderStatus`, `EmailNotificationEventType`, `EmailNotificationStatus`, `ChatConversationStatus`, `ProductSuggestionStatus`) bị khai thẳng trong entity trong khi `UserRole` đã được tách đúng — không nhất quán dù cùng loại vấn đề. Đồng thời rà soát mọi `const` viết hoa ở đầu file entity/service (vd `Object.values(SomeEnum)` gán vào 1 biến rồi dùng lại) — nếu enum/constant khác trong cùng codebase gọi trực tiếp tại chỗ dùng, không memoize riêng, phải nhất quán theo cách đó.

### Kiến trúc dự án (khoảng trống tự phát hiện khi build schema — chưa nằm trong 4 PR đã phân tích)

- [ ] Logic Idempotency-Key (checkout, chat) tái sử dụng helper hash/canonicalize dùng chung ở `common/utils/`, không viết lại từng module (CODING_STANDARD mục 23).
- [ ] Handler WebSocket gateway không tự query DB/xử lý nghiệp vụ — chỉ gọi service, cùng nguyên tắc controller mỏng (CODING_STANDARD mục 24).
- [ ] Handler `@Cron()` mới tự chống chạy chồng lấn và có giới hạn batch tường minh (CODING_STANDARD mục 25).
- [ ] Field tiền (VND) validate cận trên `string` trước khi ép `Number` để tính, không dùng `parseFloat` trực tiếp lên input chưa kiểm (CODING_STANDARD mục 26).

### Bổ sung sau khi đối chiếu 2 PR khác stack (Prisma + Kafka, 10/09/2026)

Không nằm trong 4 PR TypeORM gốc, nhưng lặp lại xuyên suốt cả 2 PR mới nên được coi là thói quen review thật, không phải suy luận lý thuyết:

- [ ] 🔴 Khi một hành động **bù trừ/rollback** (xóa file/object mồ côi, hoàn kho, hủy giao dịch...) tự nó thất bại — đã có chiến lược rõ ràng hơn "log rồi bỏ qua" (retry/reconciliation job định kỳ, dead-letter, cảnh báo), không chỉ `catch { logger.error(...) }` rồi dừng. Mini Shop **đã có** câu trả lời đúng cho trường hợp cụ thể này ở CODING_STANDARD mục 6 ("Lưu ý theo mentor" — dọn file mồ côi bằng cron hàng tháng, không chặn transaction chính); khi hiện thực attachments/avatar, phải nối đúng vào cơ chế cron đó chứ không viết lại kiểu try/catch-and-log độc lập (nguồn: PR thanhnn-3239/realworld-tutorial#22 — reviewer hỏi lại 3 lần riêng biệt dạng "nếu xóa/cleanup bị lỗi thì xử lý thế nào", mỗi lần một hàm khác nhau).
- [ ] 🔴 Một nghiệp vụ vừa ghi DB vừa gửi side-effect ra hệ thống ngoài (publish message queue, gọi webhook, gửi email) — đã xử lý rõ trường hợp DB ghi thành công nhưng gửi side-effect thất bại (event/thông báo mất vĩnh viễn); không coi "gửi ngay sau khi transaction DB commit" là an toàn mặc định (dual-write problem kinh điển). Áp dụng cho notifications module hiện tại (`email-notification.entity.ts`) và bất kỳ tích hợp message queue/webhook nào sau này (nguồn: PR yenvt-0228/store-web#10 — reviewer: "khi errors, Order đã lưu trong database nhưng event có thể bị mất, cần tối ưu lại logic trong transaction tạo order").
- [ ] Handler nhận message/event từ nguồn phát **at-least-once** (message queue, webhook) kiểm tra id đã xử lý chưa trước khi chạy side-effect (idempotent consumer) — broker/webhook có thể gửi trùng, khác với Idempotency-Key ở CODING_STANDARD mục 23 (đó là chống client tự retry, đây là chống broker tự retry) (nguồn: PR yenvt-0228/store-web#10 — reviewer: "co cần check eventId, event trùng lặp không").

### Bảo mật 🟡 (chưa từng bị nhắc trong 4 PR — khoảng trống thật, không phải đã kiểm và pass)

- [ ] Input từ client validate bằng DTO allow-list (class-validator), không deny-list.
- [ ] Upload file: giới hạn kích thước, kiểm tra MIME/magic byte (không chỉ tin extension), server tự sinh tên file ngẫu nhiên (CODING_STANDARD mục 8 đã có phần MIME, bổ sung thêm magic-byte theo OWASP).
- [ ] Không log/trả về password, token, secret trong response hoặc log (CODING_STANDARD mục 9 đã có phần envelope lỗi không leak message gốc).
- [ ] Secret/credential lấy từ env qua `ConfigService.getOrThrow()`, không hardcode (CODING_STANDARD mục 17.3).
- [ ] Endpoint có guard RBAC/ownership đúng — không dựa vào ẩn route ở FE.
- [ ] Raw query/QueryBuilder dùng parameter binding, không nối chuỗi trực tiếp từ input.

### Testing 🟡

- [ ] Unit test phủ nhánh nghiệp vụ quan trọng vừa sửa (đặc biệt N+1/transaction/concurrency ở trên) — không chỉ happy path (CODING_STANDARD mục 11).
- [ ] Có test cho nhánh lỗi (email trùng, token hết hạn, file không hợp lệ...), không chỉ test đường thành công.
- [ ] Nếu sửa bug logic, có regression test tái hiện đúng lỗi trước khi sửa.

### Git & PR Hygiene 🟡

- [ ] Commit theo Conventional Commits, không gộp nhiều thay đổi không liên quan vào 1 commit (CONTRIBUTING.md).
- [ ] PR description nêu rõ mục đích, phạm vi ảnh hưởng, cách verify — dùng đúng `.github/PULL_REQUEST_TEMPLATE.md`.
- [ ] Đã tự đọc lại toàn bộ diff trước khi request review — reviewer thật sẽ **không soát lại kỹ sau khi bạn sửa**, nên sửa đúng và đủ ngay từ lần đầu.
- [ ] Việc bị dời sang sau (theo góp ý review) đã có ghi chú/ticket theo dõi, không lặng lẽ bỏ quên.

### Documentation & Observability

- [ ] Swagger cập nhật nếu thêm/đổi endpoint (CODING_STANDARD mục 19).
- [ ] Env var mới đã thêm vào `.env.example` kèm mô tả.
- [ ] 🔴 Các xử lý được coi là quan trọng (rate-limit, upload, auth, xóa/dọn tài nguyên mồ côi ở storage ngoài) có `Logger` ghi đủ ngữ cảnh để debug sau này — không chỉ log khi lỗi, mà cả khi thực hiện thao tác xóa/dọn, để truy vết được trên production (vd AWS CloudWatch) (nguồn bổ sung: PR thanhnn-3239/realworld-tutorial#22).

## Nguồn tham khảo dùng để bổ sung phần 🟡

- [Google Engineering Practices — The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html)
- [Conventional Comments](https://conventionalcomments.org/) — chuẩn gắn nhãn mức độ nghiêm trọng cho comment review, dự án hiện chưa dùng.
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [The Twelve-Factor App — Config & Logs](https://12factor.net/config)

## Cách dùng

Chạy checklist này **sau** khi đã qua checklist mục 27 của `CODING_STANDARD.md` (nó phủ phần nền tảng/core), coi đây là lượt soát cuối tập trung vào đúng những gì reviewer thật hay bắt. Có thể yêu cầu Claude "chạy checklist docs/process/pr-self-review-checklist.md lên diff hiện tại" trước khi mở PR.
