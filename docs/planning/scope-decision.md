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
