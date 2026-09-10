import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateShopSchema1788953076401 implements MigrationInterface {
  name = 'CreateShopSchema1788953076401';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "attachments" ("id" uuid NOT NULL, "storage_key" character varying(255) NOT NULL, "mime_type" character varying(100) NOT NULL, "size_bytes" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_attachments_storage_key" UNIQUE ("storage_key"), CONSTRAINT "ck_attachments_size_bytes" CHECK (size_bytes > 0 AND size_bytes <= 2097152), CONSTRAINT "ck_attachments_mime_type" CHECK (mime_type IN ('image/jpeg', 'image/png', 'image/webp')), CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL, "name" character varying(100) NOT NULL, "slug" character varying(120) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_categories_slug" UNIQUE ("slug"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_categories_created_id" ON "categories" ("created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_categories_active_created_id" ON "categories" ("is_active", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL, "category_id" uuid NOT NULL, "image_id" uuid, "name" character varying(200) NOT NULL, "description" text NOT NULL, "sku" character varying(64) NOT NULL, "price_vnd" numeric(14,0) NOT NULL, "stock" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "is_featured" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_products_image_id" UNIQUE ("image_id"), CONSTRAINT "uq_products_sku" UNIQUE ("sku"), CONSTRAINT "ck_products_stock_nonnegative" CHECK (stock >= 0), CONSTRAINT "ck_products_price_range" CHECK (price_vnd BETWEEN 1 AND 1000000000), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_products_created_id" ON "products" ("created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_products_category_active_created_id" ON "products" ("category_id", "is_active", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_products_active_created_id" ON "products" ("is_active", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL, "email" character varying(254) NOT NULL, "username" character varying(30) NOT NULL, "password_hash" character varying(255) NOT NULL, "role" character varying(16) NOT NULL DEFAULT 'CUSTOMER', "status" character varying(24) NOT NULL DEFAULT 'PENDING', "email_verified_at" TIMESTAMP WITH TIME ZONE, "token_version" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_users_username" UNIQUE ("username"), CONSTRAINT "uq_users_email" UNIQUE ("email"), CONSTRAINT "ck_users_status" CHECK (status IN ('PENDING', 'ACTIVE', 'INACTIVE')), CONSTRAINT "ck_users_role" CHECK (role IN ('CUSTOMER', 'ADMIN')), CONSTRAINT "ck_users_token_version_nonnegative" CHECK (token_version >= 0), CONSTRAINT "ck_users_username_normalized" CHECK (username = lower(btrim(username))), CONSTRAINT "ck_users_email_normalized" CHECK (email = lower(btrim(email))), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_users_status_created_id" ON "users" ("status", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, "rating" smallint NOT NULL, "comment" character varying(2000) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_reviews_user_product" UNIQUE ("user_id", "product_id"), CONSTRAINT "ck_reviews_rating_range" CHECK (rating BETWEEN 1 AND 5), CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_reviews_product_created_id" ON "reviews" ("product_id", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "product_suggestions" ("id" uuid NOT NULL, "customer_id" uuid NOT NULL, "name" character varying(200) NOT NULL, "description" text, "category_name" character varying(100), "status" character varying(16) NOT NULL DEFAULT 'PENDING', "reviewed_by" uuid, "review_reason" text, "reviewed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ck_product_suggestions_review_consistency" CHECK ((status = 'PENDING' AND reviewed_by IS NULL AND reviewed_at IS NULL AND review_reason IS NULL) OR (status = 'APPROVED' AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL) OR (status = 'REJECTED' AND reviewed_by IS NOT NULL AND reviewed_at IS NOT NULL AND review_reason IS NOT NULL AND btrim(review_reason) <> '')), CONSTRAINT "ck_product_suggestions_status" CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')), CONSTRAINT "ck_product_suggestions_name_length" CHECK (char_length(name) BETWEEN 2 AND 200), CONSTRAINT "PK_82d7b93590707649258cee10b26" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_suggestions_reviewed_by" ON "product_suggestions" ("reviewed_by") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_suggestions_status_created_id" ON "product_suggestions" ("status", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_product_suggestions_customer_created_id" ON "product_suggestions" ("customer_id", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "orders" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "status" character varying(16) NOT NULL DEFAULT 'PENDING', "total_vnd" numeric(14,0) NOT NULL, "payment_method" character varying(16) NOT NULL DEFAULT 'COD', "recipient_name" character varying(100) NOT NULL, "phone" character varying(20) NOT NULL, "address_snapshot" text NOT NULL, "customer_note" text, "rejection_reason" text, "idempotency_key" uuid NOT NULL, "request_hash" character(64) NOT NULL, "completed_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_orders_user_idempotency_key" UNIQUE ("user_id", "idempotency_key"), CONSTRAINT "ck_orders_rejection_reason_consistency" CHECK ((status = 'REJECTED' AND rejection_reason IS NOT NULL AND btrim(rejection_reason) <> '') OR (status <> 'REJECTED' AND rejection_reason IS NULL)), CONSTRAINT "ck_orders_completed_at_consistency" CHECK ((status = 'COMPLETED') = (completed_at IS NOT NULL)), CONSTRAINT "ck_orders_request_hash_format" CHECK (request_hash ~ '^[0-9a-f]{64}$'), CONSTRAINT "ck_orders_total_range" CHECK (total_vnd BETWEEN 1 AND 1980000000000), CONSTRAINT "ck_orders_payment_method" CHECK (payment_method = 'COD'), CONSTRAINT "ck_orders_status" CHECK (status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED')), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_orders_completed_stats" ON "orders" ("status", "completed_at", "id") WHERE status = 'COMPLETED'`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_orders_created_id" ON "orders" ("created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_orders_status_created_id" ON "orders" ("status", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_orders_user_created_id" ON "orders" ("user_id", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_status_history" ("id" uuid NOT NULL, "order_id" uuid NOT NULL, "from_status" character varying(16), "to_status" character varying(16) NOT NULL, "actor_user_id" uuid, "reason" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ck_order_status_history_transition" CHECK ((from_status IS NULL AND to_status = 'PENDING') OR (from_status IS NOT NULL AND from_status <> to_status)), CONSTRAINT "ck_order_status_history_from_status" CHECK (from_status IS NULL OR from_status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED')), CONSTRAINT "ck_order_status_history_to_status" CHECK (to_status IN ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED')), CONSTRAINT "PK_e6c66d853f155531985fc4f6ec8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_status_history_actor" ON "order_status_history" ("actor_user_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_status_history_order_created_id" ON "order_status_history" ("order_id", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "order_items" ("id" uuid NOT NULL, "order_id" uuid NOT NULL, "product_id" uuid NOT NULL, "product_name_snapshot" character varying(200) NOT NULL, "sku_snapshot" character varying(64) NOT NULL, "unit_price_vnd" numeric(14,0) NOT NULL, "quantity" integer NOT NULL, "line_total_vnd" numeric(14,0) NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_order_items_order_product" UNIQUE ("order_id", "product_id"), CONSTRAINT "ck_order_items_line_total_matches" CHECK (line_total_vnd = unit_price_vnd * quantity), CONSTRAINT "ck_order_items_quantity_range" CHECK (quantity BETWEEN 1 AND 99), CONSTRAINT "ck_order_items_unit_price_range" CHECK (unit_price_vnd BETWEEN 1 AND 1000000000), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_order_items_product" ON "order_items" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_conversations" ("id" uuid NOT NULL, "customer_id" uuid NOT NULL, "assigned_admin_id" uuid, "status" character varying(16) NOT NULL DEFAULT 'OPEN', "last_message_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ck_chat_conversations_status" CHECK (status IN ('OPEN', 'CLOSED')), CONSTRAINT "PK_ff117d9f57807c4f2e3034a39f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_chat_conversations_admin_status_last_message_id" ON "chat_conversations" ("assigned_admin_id", "status", "last_message_at", "id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_chat_conversations_status_last_message_id" ON "chat_conversations" ("status", "last_message_at", "id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_chat_conversations_customer_open" ON "chat_conversations" ("customer_id") WHERE status = 'OPEN'`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" uuid NOT NULL, "conversation_id" uuid NOT NULL, "sender_id" uuid NOT NULL, "idempotency_key" uuid NOT NULL, "request_hash" character(64) NOT NULL, "body" character varying(2000) NOT NULL, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_chat_messages_sender_idempotency_key" UNIQUE ("sender_id", "idempotency_key"), CONSTRAINT "ck_chat_messages_body_length" CHECK (char_length(body) BETWEEN 1 AND 2000), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_chat_messages_conversation_created_id" ON "chat_messages" ("conversation_id", "created_at", "id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_tokens" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "type" character varying(24) NOT NULL, "token_hash" character(64) NOT NULL, "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL, "used_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_auth_tokens_token_hash" UNIQUE ("token_hash"), CONSTRAINT "ck_auth_tokens_type" CHECK (type IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET')), CONSTRAINT "ck_auth_tokens_expires_after_created" CHECK (expires_at > created_at), CONSTRAINT "PK_41e9ddfbb32da18c4e85e45c2fd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_auth_tokens_user_type_created" ON "auth_tokens" ("user_id", "type", "created_at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "email_notifications" ("id" uuid NOT NULL, "order_id" uuid, "auth_token_id" uuid, "report_period" date, "event_type" character varying(32) NOT NULL, "recipient_email" character varying(254) NOT NULL, "locale" character varying(2) NOT NULL, "payload" jsonb NOT NULL, "secret_ciphertext" bytea, "status" character varying(16) NOT NULL DEFAULT 'PENDING', "attempts" integer NOT NULL DEFAULT '0', "sent_at" TIMESTAMP WITH TIME ZONE, "last_error" text, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "ck_email_notifications_secret_only_for_auth" CHECK (secret_ciphertext IS NULL OR auth_token_id IS NOT NULL), CONSTRAINT "ck_email_notifications_single_context" CHECK ((auth_token_id IS NOT NULL AND order_id IS NULL AND report_period IS NULL) OR (order_id IS NOT NULL AND auth_token_id IS NULL AND report_period IS NULL) OR (report_period IS NOT NULL AND auth_token_id IS NULL AND order_id IS NULL)), CONSTRAINT "ck_email_notifications_payload_is_object" CHECK (jsonb_typeof(payload) = 'object'), CONSTRAINT "ck_email_notifications_attempts_range" CHECK (attempts BETWEEN 0 AND 3), CONSTRAINT "ck_email_notifications_locale" CHECK (locale IN ('vi', 'en')), CONSTRAINT "ck_email_notifications_status" CHECK (status IN ('PENDING', 'SENT', 'FAILED')), CONSTRAINT "ck_email_notifications_event_type" CHECK (event_type IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET', 'ORDER_PLACED', 'ORDER_CONFIRMED', 'ORDER_REJECTED', 'MONTHLY_REVENUE')), CONSTRAINT "PK_f4d8ce5003f1ce04365090df2d2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_email_notifications_status_updated_id" ON "email_notifications" ("status", "updated_at", "id") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_email_notifications_report_recipient" ON "email_notifications" ("recipient_email", "event_type", "report_period") WHERE report_period IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_email_notifications_order_event" ON "email_notifications" ("order_id", "event_type") WHERE order_id IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "idx_email_notifications_auth_token" ON "email_notifications" ("auth_token_id") WHERE auth_token_id IS NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart_items" ("id" uuid NOT NULL, "user_id" uuid NOT NULL, "product_id" uuid NOT NULL, "quantity" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_cart_items_user_product" UNIQUE ("user_id", "product_id"), CONSTRAINT "ck_cart_items_quantity_range" CHECK (quantity BETWEEN 1 AND 99), CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_cart_items_product" ON "cart_items" ("product_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_9a5f6868c96e0069e699f33e124" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_691a4cf972284fceae2424e987f" FOREIGN KEY ("image_id") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suggestions" ADD CONSTRAINT "FK_8fd9ac79973895e02ce35d2e60d" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suggestions" ADD CONSTRAINT "FK_e8614635833e8ba43ceee9a15d3" FOREIGN KEY ("reviewed_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" ADD CONSTRAINT "FK_1ca7d5228cf9dc589b60243933c" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" ADD CONSTRAINT "FK_8cba98ff23b1e3fe74b932dbe7b" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_145532db85752b29c57d2b7b1f1" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" ADD CONSTRAINT "FK_9263386c35b6b242540f9493b00" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_conversations" ADD CONSTRAINT "FK_f78efda285469da358dc6189bbb" FOREIGN KEY ("customer_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_conversations" ADD CONSTRAINT "FK_0f76c6bec9128290b46f253b56d" FOREIGN KEY ("assigned_admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_3d623662d4ee1219b23cf61e649" FOREIGN KEY ("conversation_id") REFERENCES "chat_conversations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_tokens" ADD CONSTRAINT "FK_9691367d446cd8b18f462c191b3" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_c831c6efe32babbbcc42daef850" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_notifications" ADD CONSTRAINT "FK_59c11755ee393145b4427103416" FOREIGN KEY ("auth_token_id") REFERENCES "auth_tokens"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_b7213c20c1ecdc6597abc8f1212" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" ADD CONSTRAINT "FK_30e89257a105eab7648a35c7fce" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_30e89257a105eab7648a35c7fce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart_items" DROP CONSTRAINT "FK_b7213c20c1ecdc6597abc8f1212"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_59c11755ee393145b4427103416"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_notifications" DROP CONSTRAINT "FK_c831c6efe32babbbcc42daef850"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_tokens" DROP CONSTRAINT "FK_9691367d446cd8b18f462c191b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_3d623662d4ee1219b23cf61e649"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_conversations" DROP CONSTRAINT "FK_0f76c6bec9128290b46f253b56d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_conversations" DROP CONSTRAINT "FK_f78efda285469da358dc6189bbb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_9263386c35b6b242540f9493b00"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_items" DROP CONSTRAINT "FK_145532db85752b29c57d2b7b1f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" DROP CONSTRAINT "FK_8cba98ff23b1e3fe74b932dbe7b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "order_status_history" DROP CONSTRAINT "FK_1ca7d5228cf9dc589b60243933c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suggestions" DROP CONSTRAINT "FK_e8614635833e8ba43ceee9a15d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_suggestions" DROP CONSTRAINT "FK_8fd9ac79973895e02ce35d2e60d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_9482e9567d8dcc2bc615981ef44"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" DROP CONSTRAINT "FK_728447781a30bc3fcfe5c2f1cdf"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_691a4cf972284fceae2424e987f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_9a5f6868c96e0069e699f33e124"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_cart_items_product"`);
    await queryRunner.query(`DROP TABLE "cart_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_email_notifications_auth_token"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_email_notifications_order_event"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_email_notifications_report_recipient"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_email_notifications_status_updated_id"`,
    );
    await queryRunner.query(`DROP TABLE "email_notifications"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_auth_tokens_user_type_created"`,
    );
    await queryRunner.query(`DROP TABLE "auth_tokens"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_chat_messages_conversation_created_id"`,
    );
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_chat_conversations_customer_open"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_chat_conversations_status_last_message_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_chat_conversations_admin_status_last_message_id"`,
    );
    await queryRunner.query(`DROP TABLE "chat_conversations"`);
    await queryRunner.query(`DROP INDEX "public"."idx_order_items_product"`);
    await queryRunner.query(`DROP TABLE "order_items"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_order_status_history_order_created_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_order_status_history_actor"`,
    );
    await queryRunner.query(`DROP TABLE "order_status_history"`);
    await queryRunner.query(`DROP INDEX "public"."idx_orders_user_created_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_orders_status_created_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_orders_created_id"`);
    await queryRunner.query(`DROP INDEX "public"."idx_orders_completed_stats"`);
    await queryRunner.query(`DROP TABLE "orders"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_product_suggestions_customer_created_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_product_suggestions_status_created_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_product_suggestions_reviewed_by"`,
    );
    await queryRunner.query(`DROP TABLE "product_suggestions"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_reviews_product_created_id"`,
    );
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_users_status_created_id"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_products_active_created_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."idx_products_category_active_created_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_products_created_id"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_categories_active_created_id"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_categories_created_id"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
  }
}
