---
name: pr-self-review
description: Chạy checklist tự-review trước khi mở PR, đối chiếu diff hiện tại với docs/process/pr-self-review-checklist.md (rút từ comment review thật của mentor trên 4 PR học viên khác). Dùng khi user gõ /pr-self-review, hoặc khi user nói "review trước khi mở PR", "check trước khi push", "so với checklist reviewer".
---

# PR Self-Review

Đối chiếu diff hiện tại với checklist đã rút từ pattern review thật của mentor (`lamnv-1116`), để bắt trước những lỗi mentor hay bắt — trước khi PR được gửi đi thật.

## Bước 1 — Xác định diff cần soát

- Không có argument: dùng `git diff main...HEAD` (toàn bộ thay đổi của nhánh hiện tại so với `main`) cộng `git diff` (uncommitted) nếu có.
- Argument là một path: chỉ soát diff của path đó.
- Argument là một branch/ref khác: `git diff <ref>...HEAD`.
- Argument là số PR (vd `#12` hoặc chỉ số nguyên): dùng `gh pr diff <number>` nếu `gh` sẵn có và repo có remote; nếu không, báo cho user biết không lấy được diff PR và dừng lại — không tự đoán.

Nếu diff rỗng, báo ngay "Không có thay đổi để review" và dừng, không tạo báo cáo rỗng.

## Bước 2 — Đọc checklist nguồn

Đọc toàn bộ `docs/process/pr-self-review-checklist.md` bằng Read tool **mỗi lần chạy** — không hardcode lại nội dung checklist trong skill này, vì file có thể được cập nhật sau. Lấy đúng các dòng bắt đầu bằng `- [ ]` (bỏ qua các mục đã tự đánh dấu hoàn thành `- [x]` nếu có) làm danh sách mục cần chấm, giữ nguyên cờ 🔴/🟡 và section (Database & Performance, Code Structure, Bảo mật, Testing, Git & PR Hygiene, Documentation & Observability) của từng mục.

Nếu không tìm thấy file này trong repo, báo lỗi rõ ràng và dừng — không tự bịa checklist thay thế.

## Bước 3 — Chấm từng mục theo diff thật

Với mỗi mục checklist, đọc kỹ nội dung file/dòng liên quan trong diff (không chỉ đoán từ tên biến/import) rồi kết luận một trong ba:

- **PASS** — diff tuân thủ đúng mục này.
- **FAIL** — vi phạm cụ thể, phải trích dẫn đúng `file:dòng` và giải thích ngắn gọn vi phạm ở đâu.
- **N/A** — mục không áp dụng cho diff này (vd diff không đụng tới bảng nào thì bỏ qua toàn bộ mục Database; diff không có upload file thì bỏ qua phần MIME/magic-byte).

**Ưu tiên nghiêm ngặt mục 🔴 hơn 🟡** khi quyết định PR đã sẵn sàng hay chưa — 🔴 là pattern có bằng chứng thật từ reviewer, còn 🟡 là gợi ý bổ sung từ chuẩn ngành, quan trọng nhưng không phải thứ reviewer này đã từng bắt lỗi.

Không tự sửa code ở bước này — chỉ chấm và báo cáo. Chỉ sửa khi người dùng yêu cầu rõ sau khi xem báo cáo.

## Bước 4 — Xuất báo cáo

Trình bày theo đúng section của checklist gốc, mỗi mục một dòng dạng:

```
[PASS|FAIL|N/A] 🔴|🟡 <nội dung mục rút gọn> — <dẫn chứng file:dòng nếu FAIL>
```

Kết thúc bằng một câu tóm tắt rõ ràng: liệt kê số lượng FAIL 🔴 (phải sửa trước khi mở PR) tách riêng khỏi FAIL 🟡 (nên cân nhắc), rồi kết luận thẳng "Sẵn sàng mở PR" hoặc "Chưa nên mở PR — còn N mục 🔴 chưa qua".
