/**
 * Role là khái niệm cross-cutting: RBAC (`@Roles()`/`RolesGuard`) cần giá trị này ở controller
 * của HẦU HẾT module (products, categories, orders, chat, product-suggestions, notifications...),
 * không chỉ module `users` sở hữu cột DB `users.role`. Đặt ở common/ để các module đó import trực
 * tiếp, không phải tạo dependency `→ users` chỉ vì cần một enum RBAC — cùng nguyên tắc với
 * `@CurrentUser` ở CODING_STANDARD.md mục 10 ("thứ nhiều module cùng dùng thuộc common/").
 * `user.entity.ts` import lại enum này để khai cột `role`, không định nghĩa trùng.
 */
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
}
