import { z as validate } from "zod";

export const voucherSchema = validate.object({
    discount_amount: validate.number().min(1, "Discount amount is required"),
    expire_period: validate
    .number()
    .min(1, "Expiration period must be at least 1 month")
    .max(12, "Expiration period cannot exceed 12 months"),
})