# Quy trình triển khai dự án phần mềm có khách hàng

Quy trình này dùng cho một backend có khách hàng thật và được thu gọn để áp dụng cho Mini Shop. Mentor đóng vai Technical Lead; người xác nhận chức năng đóng vai Product Owner; người học là Developer kiêm QA ở những bước không có QA riêng.

## 1. Vai trò và quyền quyết định

| Vai trò            | Trách nhiệm                                         | Quyết định cuối                        |
| ------------------ | --------------------------------------------------- | -------------------------------------- |
| Customer sponsor   | Mục tiêu kinh doanh, ngân sách, deadline            | Có đầu tư/release hay không            |
| Product Owner/BA   | Làm rõ nhu cầu, thứ tự backlog, acceptance criteria | Feature nào được nhận và ưu tiên nào   |
| Tech Lead/Mentor   | Kiến trúc, rủi ro kỹ thuật, code/database review    | Giải pháp kỹ thuật có được merge không |
| Developer          | Thiết kế chi tiết, code, migration, test, tài liệu  | Cách triển khai trong phạm vi đã duyệt |
| QA                 | Test plan, exploratory/regression, evidence         | Build có đủ điều kiện vào UAT không    |
| DevOps/SRE         | CI/CD, secrets, deploy, monitoring, rollback        | Release có an toàn để vận hành không   |
| Customer UAT users | Chạy kịch bản nghiệp vụ trên staging                | Nghiệm thu hoặc nêu defect/gap         |

Một người có thể giữ nhiều vai trò trong mock project, nhưng không được xóa bước kiểm tra tương ứng. Developer không tự hiểu im lặng của khách hàng là approval.

## 2. Vòng đời và các cổng quyết định

| Gate | Giai đoạn            | Đầu ra bắt buộc                                              | Ai duyệt                      |
| ---- | -------------------- | ------------------------------------------------------------ | ----------------------------- |
| G0   | Khởi động            | Project charter, stakeholder, kênh liên lạc, cách approval   | Sponsor/PO                    |
| G1   | Discovery            | Problem statement, user journey, phạm vi và glossary         | PO/customer                   |
| G2   | Requirement baseline | User story/API contract, AC, priority, NFR, out-of-scope     | PO + Tech Lead                |
| G3   | Solution design      | ERD, architecture, security, integration, ADR, estimate/risk | Tech Lead; PO duyệt trade-off |
| G4   | Delivery readiness   | Repo, CI, environments, DoR/DoD, release strategy            | Tech Lead/DevOps              |
| G5   | Feature acceptance   | PR xanh, review, QA evidence, Swagger/migration              | Tech Lead + QA                |
| G6   | UAT readiness        | Staging build, test report, data và UAT script               | QA + PO                       |
| G7   | Release approval     | Release note, migration/backup/rollback, owner trực          | PO + DevOps                   |
| G8   | Post-release         | Monitoring evidence, incident review, support handover       | Sponsor/PO/Tech Lead          |

Không cần chờ G3 để tạo repo, CI hay Docker local. Không triển khai business rule đang tranh luận trước G2/G3; foundation độc lập có thể chạy song song.

## 3. G0 — Khởi động dự án

Tạo một project charter một trang:

- Vấn đề khách hàng muốn giải quyết và chỉ số thành công.
- Người dùng/role chính, stakeholder và người có quyền sign-off.
- Deadline, ngân sách, capacity thực tế và múi giờ làm việc.
- Phạm vi cấp cao, giới hạn pháp lý/bảo mật và hệ thống tích hợp.
- Kênh trao đổi, cadence demo, thời hạn phản hồi và cách ghi quyết định.
- Định nghĩa severity, thời gian phản hồi incident và thời gian bảo hành.

Với Mini Shop: allocation ban đầu 80 giờ; capacity 5,2 giờ/ngày; yellow là bắt buộc; white ưu tiên thấp; mục tiêu cá nhân full scope là 130 giờ. Quyết định này nằm trong `docs/planning/scope-decision.md`.

## 4. G1–G2 — Discovery và requirement baseline

### 4.1 Từ nhu cầu đến yêu cầu kiểm thử được

Mỗi chức năng phải trả lời:

1. Ai thực hiện và vì sao?
2. Precondition là gì?
3. Input, validation và quyền sở hữu dữ liệu?
4. Dữ liệu nào được đọc/ghi?
5. Response thành công và lỗi?
6. Side effect nào xảy ra: mail, queue, file, stock?
7. Acceptance criteria nào chứng minh Done?

Viết acceptance criteria theo Given/When/Then. Ví dụ checkout:

> Given customer có giỏ hợp lệ và stock còn đủ, when gửi checkout với idempotency key mới, then tạo một order PENDING, snapshot giá, giảm stock, xóa giỏ và ghi mail intent trong cùng transaction. Nếu một item hết hàng, toàn bộ thay đổi rollback.

### 4.2 Phân loại yêu cầu

- Functional: API/trigger người dùng nhìn thấy.
- Business rule: trạng thái, giá, tồn, ownership, điều kiện review.
- Non-functional: performance, security, availability, audit, privacy, backup.
- Constraint: framework, database, deadline, provider, coding standard.
- Out-of-scope: viết rõ để tránh mỗi bên hiểu khác nhau.

Mỗi requirement có ID ổn định. Luồng truy vết là:

```text
REQ-ID → backlog task → branch/commit → PR → test case → release note
```

Thay đổi wording không đổi ID. Tách behavior mới thì tạo ID mới. Requirement chỉ được baseline khi PO xác nhận; cập nhật sau đó đi qua change request.

### 4.3 Definition of Ready

Một task chỉ vào `Ready` khi:

- Có requirement ID, user/role, priority và business value.
- AC gồm happy path, validation, permission và failure quan trọng.
- API/DB/integration dependency đã rõ; mock/credential test đã có.
- UI/API contract hoặc example payload đủ để hai bên hiểu giống nhau.
- Estimate, owner, reviewer và test approach đã có.
- Không còn câu hỏi làm thay đổi schema hoặc public contract.

## 5. G3 — Thiết kế giải pháp

### 5.1 Thiết kế database

Đi từ query và invariant, không đi từ tên entity:

- Liệt kê dữ liệu phải tồn tại sau mỗi use case.
- Vẽ cardinality, PK/FK, UNIQUE, CHECK, nullable và delete policy.
- Xác định snapshot/history/audit; không đọc dữ liệu hiện tại để sửa lịch sử cũ.
- Liệt kê query list/filter/sort; index phải phục vụ query thật.
- Đánh dấu transaction boundary, lock order, idempotency và retry.
- Chạy self-review rồi Tech Lead review trước migration lớn.

### 5.2 Thiết kế kiến trúc

Ghi context/container/component ở mức đủ quyết định:

- Client → API → PostgreSQL, Redis/Bull, SMTP/storage và external provider.
- Module boundaries và ownership của dữ liệu.
- Authentication, RBAC, ownership và secret management.
- Sync/async boundary; điều gì commit trước khi enqueue/publish.
- Failure mode, timeout, retry, idempotency và observability.
- Deployment topology, backup/restore và rollback compatibility.

Quyết định có trade-off dài hạn được ghi bằng ADR: context, options, decision, consequences và ngày duyệt. Không dùng ADR để ghi việc nhỏ không có lựa chọn đáng kể.

### 5.3 Estimate và kế hoạch

Estimate theo feature gồm code, unit/e2e, review, fix, migration, docs và deploy evidence. Dùng range khi còn rủi ro. Capacity khác elapsed time: 130 giờ ở 5,2 giờ/ngày là 25 ngày làm việc.

Dành buffer cho integration và feedback. Nếu scope/deadline/budget không thể đồng thời đạt, PO chọn trade-off; developer không âm thầm bỏ test hoặc security.

## 6. G4 — Repository và môi trường

### 6.1 Môi trường

| Môi trường | Mục đích                   | Dữ liệu                                   |
| ---------- | -------------------------- | ----------------------------------------- |
| Local      | Phát triển/debug           | Fake/demo, có thể reset                   |
| CI test    | Unit/e2e/migration tự động | Tạo mới, cách ly mỗi run                  |
| Staging    | QA, demo, UAT              | Dữ liệu giả giống production về hình dạng |
| Production | Người dùng thật            | Có backup, access control và audit        |

Không dùng production credential/data cho test. Secret đi qua secret manager hoặc environment của nền tảng; không commit `.env` thật.

### 6.2 Git và branch

Project nhỏ dùng protected `main` và branch ngắn hạn:

```text
main
 ├─ feature/pull-<n>-short-name   # ví dụ feature/pull-4-schema-seed — theo CONTRIBUTING.md
 ├─ fix/pull-<n>-bugfix-name
 └─ chore/tooling-name
```

- Mỗi branch tạo từ `main` mới nhất sau khi baseline trước đã merge.
- Một PR có một mục đích review được; migration đi cùng entity/behavior.
- Không merge khi CI đỏ, review chưa approve hoặc unresolved comment còn mở.
- Squash merge nếu team muốn lịch sử một commit/PR; giữ Conventional Commit cho changelog.
- Hotfix vẫn qua PR; sau production phải đồng bộ về nhánh phát triển chính.
- Release đánh tag bất biến, ví dụ `v0.1.0`; artifact deploy lấy từ commit/tag đã test.

Không cần `develop` cho một team nhỏ nếu staging có thể deploy từ PR/main. Thêm nhánh dài hạn chỉ khi release train hoặc nhiều version phải bảo trì song song.

### 6.3 Base repository

Baseline phải có config validation, migration runner, formatter/linter, unit/e2e harness, CI, local infrastructure, health endpoint, logging/error envelope và coding convention. Base không chứa domain mẫu không dùng.

Flow thiết lập hiện tại:

1. Push `main` với commit khởi tạo.
2. Push `feature/pull-3-foundation`.
3. Mở PR foundation vào `main`, dùng template và đính kèm kết quả gate.
4. Mentor review/approve rồi merge.
5. Developer checkout/pull `main` vừa merge và tạo branch schema/auth tiếp theo từ đó.

Không tạo các PR độc lập từ empty `main` trong khi foundation chưa merge. Nếu phải làm song song, tạo stacked branch từ foundation và rebase lên `main` sau khi foundation merge.

## 7. G5 — Vòng lặp triển khai một feature

Thực hiện một vertical slice theo thứ tự:

1. Chuyển task từ Ready sang In Progress; ghi requirement ID.
2. Pull/rebase `main`, tạo branch.
3. Viết/chỉnh migration và entity nếu cần; xác nhận `synchronize=false`.
4. Implement service business rule trước; controller/gateway chỉ nhận input và trả output.
5. Thêm DTO validation, error code/i18n, RBAC và ownership.
6. Viết unit test cho nhánh nghiệp vụ và e2e cho DB/transaction/integration thật.
7. Chạy API thủ công/exploratory; debug lỗi và kiểm tra log không lộ secret.
8. Cập nhật Swagger, requirement mapping, ADR/runbook nếu behavior thay đổi.
9. Self-review diff; chạy full PR gates.
10. Mở PR, xử lý review, re-run gate sau thay đổi và merge khi approved.

Giữ Work In Progress nhỏ. Ưu tiên lát cắt chạy được: register hoàn chỉnh tốt hơn tạo controller rỗng cho 10 module.

### Definition of Done

- AC và error cases đã qua test; không còn TODO che behavior bắt buộc.
- Authorization gồm cả role và ownership; field server quản lý không nhận từ client.
- Migration chạy từ DB sạch; rollback strategy được ghi; seed idempotent nếu có.
- Unit/e2e có giá trị; concurrency test dùng DB thật khi liên quan stock/idempotency.
- Query list có pagination/sort ổn định; index và query count được review.
- File/queue/mail failure không phá transaction đã commit.
- Swagger, release note và runbook được cập nhật.
- CI xanh; reviewer approve; known limitation được PO chấp nhận.

## 8. Kiểm thử và QA

### 8.1 Test pyramid theo rủi ro

- Unit: state transition, calculation, authorization decision, retry policy.
- Integration: repository, constraint, transaction, Redis/Bull, storage/SMTP adapter.
- E2E: critical user journey qua HTTP/WebSocket và PostgreSQL thật.
- Contract: request/response/error tương thích consumer.
- Exploratory: input bất thường, race, reconnect, retry, file hỏng, dependency down.
- Performance: query plan, p95/p99 target, dataset đủ lớn và không N+1.
- Security: authentication, privilege escalation, IDOR, mass assignment, upload, rate limit và secret leakage.

Không dùng coverage làm bằng chứng duy nhất. Coverage là sàn chống quên nhánh; acceptance và risk quyết định test nào phải có.

### 8.2 Bug workflow

Bug có environment/build, bước reproduce, expected/actual, severity, evidence và owner. Severity gợi ý:

- Sev1: production down/data loss/security breach.
- Sev2: critical flow hỏng, không có workaround.
- Sev3: feature hỏng một phần, có workaround.
- Sev4: cosmetic/documentation/low impact.

Mọi bug fix có regression test phù hợp và tham chiếu BUG-ID trong PR.

## 9. G6 — Staging và UAT

Trước UAT:

- Deploy đúng artifact/tag; migration hoàn tất và smoke test pass.
- Seed UAT có account/role và dữ liệu đủ các scenario.
- UAT script viết theo nghiệp vụ, không bắt customer đọc technical endpoint.
- Danh sách known limitation và out-of-scope đã gửi trước.
- Có nơi ghi defect/gap và người quyết định accepted/rejected.

UAT sign-off phải ghi build/version, ngày, người duyệt, scenario đã chạy và exception được chấp nhận. Yêu cầu mới phát hiện trong UAT là change request, không tự coi là bug nếu behavior đúng baseline.

## 10. Change request và quản lý phạm vi

Khi khách hàng yêu cầu thay đổi:

1. Ghi nhu cầu và lý do, không hứa deadline ngay trong cuộc gọi/chat.
2. Phân tích ảnh hưởng API, DB/migration, dữ liệu cũ, security, test, vận hành.
3. Estimate effort/range, rủi ro và lựa chọn trade-off.
4. PO/sponsor chọn: thêm ngân sách, dời deadline, bỏ scope khác hoặc hoãn.
5. Cập nhật requirement baseline, backlog, timeline và acceptance.
6. Chỉ implement sau khi quyết định được ghi nhận.

Ví dụ Mini Shop: COD → online payment không phải thay một field. Nó thêm payment session, webhook signature, idempotency, payment event, timeout, refund/reconciliation và test sandbox; estimate phải được thay đổi.

## 11. G7 — Release production

Release checklist tối thiểu nằm trong `release-checklist.md`. Luồng chuẩn:

1. Freeze release candidate và chạy regression/security/performance gates.
2. Backup và kiểm tra restore gần đây; review migration forward/backward compatibility.
3. Chuẩn bị release notes, owner trực, maintenance window và communication.
4. Deploy migration/code theo thứ tự an toàn; không chạy destructive schema change cùng lúc code cũ còn dùng.
5. Smoke critical flow và theo dõi error rate, latency, saturation, queue backlog.
6. PO xác nhận business smoke; đóng release hoặc kích hoạt rollback/forward fix.
7. Tag release và lưu evidence/decision.

Rollback code không tự rollback database. Với migration có data loss, ưu tiên expand/contract và forward fix; chỉ revert khi script đã được thử trên backup/staging.

## 12. G8 — Vận hành, support và cải tiến

Theo dõi tối thiểu:

- Request rate, p95/p99 latency, 4xx/5xx theo route.
- PostgreSQL connection/query latency/deadlock/slow query.
- Redis availability, Bull waiting/active/failed và oldest job age.
- Mail success/failure/retry, scheduler last-success.
- Disk/storage capacity, orphan files và backup status.
- Business metric: registration, checkout success, completed orders và revenue.

Mỗi alert có owner, threshold, runbook và escalation. Incident flow: detect → triage/severity → mitigate → communicate → recover → postmortem. Postmortem tập trung timeline, contributing factors, detection gap và action có owner/deadline.

Sau release, review actual effort so với estimate, defect escape, lead time và feedback khách hàng. Cập nhật coding standard/process khi có bằng chứng, không biến workaround một lần thành rule vĩnh viễn.

## 13. Cadence giao tiếp với khách hàng

- Daily nội bộ: progress, plan, blocker, risk; không gửi chi tiết code cho customer nếu họ không cần.
- 1–2 lần/tuần: backlog/refinement và câu hỏi cần PO quyết định.
- Cuối sprint/feature group: demo behavior chạy thật trên staging.
- Trước release: phạm vi, known limitations, migration/window và rollback plan.
- Sau release: kết quả smoke, monitoring và vấn đề phát sinh.

Mọi quyết định thay đổi scope/AC/deadline cần được ghi trong ticket, decision log hoặc biên bản. Chat là nguồn thảo luận; backlog/requirement baseline mới là nguồn sự thật lâu dài.

## 14. Áp dụng ngay cho Mini Shop

1. Import `docs/planning/api-requirements.csv` vào sheet cá nhân.
2. Gắn trạng thái `Proposed`, owner và câu hỏi; không tự ghi `Approved`.
3. Self-review `ecommerce.drawio`, API contract, transaction và delete policy.
4. Gửi mentor requirement + ERD + ba quyết định: COD, một ảnh/product, full scope 130 giờ.
5. Push repository và mở PR foundation hiện tại.
6. Sau approval, merge foundation vào protected `main`.
7. Tạo PR schema/auth từ `main`: users, auth tokens, email notification, migration.
8. Thực hiện yellow scope theo thứ tự auth → public catalog/admin product → cart → checkout/order → order mails.
9. Demo và regression yellow scope trước khi nhận white/Advance.
10. Chạy UAT giả lập, release checklist và handover như một dự án có khách hàng.
