-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "finpro";

-- CreateEnum
CREATE TYPE "finpro"."Role" AS ENUM ('USER', 'STORE_ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "finpro"."OrderStatus" AS ENUM ('PENDING_PAYMENT', 'AWAITING_CONFIRMATION', 'PROCESSING', 'SENT', 'ORDER_CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "finpro"."PaymentMethod" AS ENUM ('MANUAL_TRANSFER', 'MIDTRANS');

-- CreateEnum
CREATE TYPE "finpro"."PaymentStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "finpro"."ChangeType" AS ENUM ('INCREASE', 'DECREASE');

-- CreateEnum
CREATE TYPE "finpro"."ChangeCategory" AS ENUM ('SOLD', 'STOCK_CHANGE', 'OTHERS');

-- CreateEnum
CREATE TYPE "finpro"."DiscountType" AS ENUM ('PERCENTAGE', 'NOMINAL', 'BOGO');

-- CreateEnum
CREATE TYPE "finpro"."VoucherType" AS ENUM ('PERCENTAGE', 'NOMINAL');

-- CreateEnum
CREATE TYPE "finpro"."DiscountTypeEnum" AS ENUM ('SHIPPING_DISCOUNT', 'PRODUCT_DISCOUNT', 'CART_DISCOUNT');

-- CreateEnum
CREATE TYPE "finpro"."AuthProvider" AS ENUM ('GOOGLE', 'FACEBOOK');

-- CreateTable
CREATE TABLE "finpro"."Users" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "role" "finpro"."Role" NOT NULL DEFAULT 'USER',
    "referral_code" TEXT,
    "register_code" TEXT,
    "refresh_token" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "finpro"."Stores" (
    "store_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "store_name" TEXT NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "store_location" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("store_id")
);

-- CreateTable
CREATE TABLE "finpro"."Categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "finpro"."Products" (
    "product_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "product_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "finpro"."Inventories" (
    "inventory_id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "discounted_price" DECIMAL(10,2),
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Inventories_pkey" PRIMARY KEY ("inventory_id")
);

-- CreateTable
CREATE TABLE "finpro"."StockJournal" (
    "journal_id" SERIAL NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "change_type" "finpro"."ChangeType" NOT NULL,
    "change_quantity" INTEGER NOT NULL,
    "prev_stock" INTEGER NOT NULL,
    "new_stock" INTEGER NOT NULL,
    "change_category" "finpro"."ChangeCategory" DEFAULT 'OTHERS',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockJournal_pkey" PRIMARY KEY ("journal_id")
);

-- CreateTable
CREATE TABLE "finpro"."ProductImage" (
    "image_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_image" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "finpro"."Discounts" (
    "discount_id" SERIAL NOT NULL,
    "inventory_id" INTEGER,
    "store_id" INTEGER NOT NULL,
    "type" "finpro"."DiscountType" NOT NULL,
    "value" DECIMAL(10,2),
    "min_purchase" DECIMAL(10,2),
    "max_discount" DECIMAL(10,2),
    "bogo_product_id" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "image" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discounts_pkey" PRIMARY KEY ("discount_id")
);

-- CreateTable
CREATE TABLE "finpro"."Vouchers" (
    "voucher_id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "type" "finpro"."VoucherType" NOT NULL,
    "discount_type" "finpro"."DiscountTypeEnum" NOT NULL,
    "discount_amount" DECIMAL(10,2) NOT NULL,
    "min_purchase" DECIMAL(10,2),
    "max_discount" DECIMAL(10,2),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vouchers_pkey" PRIMARY KEY ("voucher_id")
);

-- CreateTable
CREATE TABLE "finpro"."UserVouchers" (
    "user_voucher_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "voucher_id" INTEGER NOT NULL,
    "is_used" BOOLEAN NOT NULL DEFAULT false,
    "used_at" TIMESTAMP(3),

    CONSTRAINT "UserVouchers_pkey" PRIMARY KEY ("user_voucher_id")
);

-- CreateTable
CREATE TABLE "finpro"."Address" (
    "address_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "latitude" DECIMAL(9,6) NOT NULL,
    "longitude" DECIMAL(9,6) NOT NULL,
    "address" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "finpro"."Carts" (
    "cart_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "cart_price" DECIMAL(10,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("cart_id")
);

-- CreateTable
CREATE TABLE "finpro"."CartItems" (
    "cart_item_id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "inventory_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "product_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItems_pkey" PRIMARY KEY ("cart_item_id")
);

-- CreateTable
CREATE TABLE "finpro"."Orders" (
    "order_id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "address_id" INTEGER NOT NULL,
    "cart_price" DECIMAL(10,2) NOT NULL,
    "order_status" "finpro"."OrderStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "shipping_method" TEXT NOT NULL,
    "shipping_price" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "finpro"."Payments" (
    "payment_id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "payment_method" "finpro"."PaymentMethod" NOT NULL,
    "payment_status" "finpro"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "payment_reference" TEXT,
    "pop_image" TEXT,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "finpro"."Sales" (
    "sales_id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "category_id" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "total_sales" INTEGER NOT NULL,

    CONSTRAINT "Sales_pkey" PRIMARY KEY ("sales_id")
);

-- CreateTable
CREATE TABLE "finpro"."UserAuthProviders" (
    "auth_provider_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "provider_name" "finpro"."AuthProvider" NOT NULL,
    "provider_user_id" TEXT NOT NULL,
    "access_token" TEXT,
    "refresh_token" TEXT,
    "token_expiry" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuthProviders_pkey" PRIMARY KEY ("auth_provider_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "finpro"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "finpro"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_referral_code_key" ON "finpro"."Users"("referral_code");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_user_id_key" ON "finpro"."Stores"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_category_name_key" ON "finpro"."Categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Products_product_name_key" ON "finpro"."Products"("product_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vouchers_code_key" ON "finpro"."Vouchers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Orders_cart_id_key" ON "finpro"."Orders"("cart_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_order_id_key" ON "finpro"."Payments"("order_id");

-- AddForeignKey
ALTER TABLE "finpro"."Stores" ADD CONSTRAINT "Stores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "finpro"."Users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Products" ADD CONSTRAINT "Products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "finpro"."Categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Inventories" ADD CONSTRAINT "Inventories_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "finpro"."Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Inventories" ADD CONSTRAINT "Inventories_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "finpro"."Products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."StockJournal" ADD CONSTRAINT "StockJournal_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "finpro"."Inventories"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."ProductImage" ADD CONSTRAINT "ProductImage_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "finpro"."Products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Discounts" ADD CONSTRAINT "Discounts_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "finpro"."Inventories"("inventory_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Discounts" ADD CONSTRAINT "Discounts_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "finpro"."Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."UserVouchers" ADD CONSTRAINT "UserVouchers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "finpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."UserVouchers" ADD CONSTRAINT "UserVouchers_voucher_id_fkey" FOREIGN KEY ("voucher_id") REFERENCES "finpro"."Vouchers"("voucher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Address" ADD CONSTRAINT "Address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "finpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Carts" ADD CONSTRAINT "Carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "finpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."CartItems" ADD CONSTRAINT "CartItems_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "finpro"."Carts"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."CartItems" ADD CONSTRAINT "CartItems_inventory_id_fkey" FOREIGN KEY ("inventory_id") REFERENCES "finpro"."Inventories"("inventory_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Orders" ADD CONSTRAINT "Orders_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "finpro"."Carts"("cart_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Orders" ADD CONSTRAINT "Orders_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "finpro"."Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Orders" ADD CONSTRAINT "Orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "finpro"."Address"("address_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Payments" ADD CONSTRAINT "Payments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "finpro"."Orders"("order_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Sales" ADD CONSTRAINT "Sales_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "finpro"."Stores"("store_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Sales" ADD CONSTRAINT "Sales_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "finpro"."Products"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."Sales" ADD CONSTRAINT "Sales_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "finpro"."Categories"("category_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "finpro"."UserAuthProviders" ADD CONSTRAINT "UserAuthProviders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "finpro"."Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
