-- AddForeignKey
ALTER TABLE "finpro"."Discounts" ADD CONSTRAINT "Discounts_bogo_product_id_fkey" FOREIGN KEY ("bogo_product_id") REFERENCES "finpro"."Products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;
