/** jobId dùng thẳng `notification.id` (deterministic) — không sinh ID riêng cho job. */
export interface MailJobData {
  notificationId: string;
}
