-- EnableExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('ORDER_RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "menu_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "menu_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(120) NOT NULL,
    "phone" VARCHAR(32) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "delivery_name" VARCHAR(120) NOT NULL,
    "delivery_phone" VARCHAR(32) NOT NULL,
    "delivery_address" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'ORDER_RECEIVED',
    "subtotal_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "menu_item_id" UUID NOT NULL,
    "item_name" VARCHAR(120) NOT NULL,
    "item_description" TEXT NOT NULL,
    "item_price_cents" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "line_total_cents" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_status_history" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "order_id" UUID NOT NULL,
    "status" "OrderStatus" NOT NULL,
    "changed_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "menu_items_isAvailable_idx" ON "menu_items"("is_available");

-- CreateIndex
CREATE UNIQUE INDEX "menu_items_name_key" ON "menu_items"("name");

-- CreateIndex
CREATE INDEX "customers_phone_idx" ON "customers"("phone");

-- CreateIndex
CREATE INDEX "orders_customerId_idx" ON "orders"("customer_id");

-- CreateIndex
CREATE INDEX "orders_status_idx" ON "orders"("status");

-- CreateIndex
CREATE INDEX "orders_createdAt_idx" ON "orders"("created_at");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("order_id");

-- CreateIndex
CREATE INDEX "order_items_menuItemId_idx" ON "order_items"("menu_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "order_items_orderId_menuItemId_key" ON "order_items"("order_id", "menu_item_id");

-- CreateIndex
CREATE INDEX "order_status_history_orderId_idx" ON "order_status_history"("order_id");

-- CreateIndex
CREATE INDEX "order_status_history_status_idx" ON "order_status_history"("status");

-- CreateIndex
CREATE INDEX "order_status_history_changedAt_idx" ON "order_status_history"("changed_at");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_menu_item_id_fkey" FOREIGN KEY ("menu_item_id") REFERENCES "menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CheckConstraints
ALTER TABLE "menu_items" ADD CONSTRAINT "menu_items_price_cents_positive" CHECK ("price_cents" > 0);
ALTER TABLE "orders" ADD CONSTRAINT "orders_subtotal_cents_non_negative" CHECK ("subtotal_cents" >= 0);
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_item_price_cents_positive" CHECK ("item_price_cents" > 0);
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_quantity_positive" CHECK ("quantity" > 0);
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_line_total_cents_positive" CHECK ("line_total_cents" > 0);
