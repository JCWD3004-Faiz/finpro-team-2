import { z as validate } from "zod";

export const discountSchema = validate.object({
  inventory_id: validate
    .union([validate.string(), validate.number()])
    .optional()
    .transform((val) => (val ? parseFloat(val.toString()) : undefined)) // Convert only if val exists
    .refine(
      (val) => val === undefined || val > 0, // Only check if val exists
      { message: "Inventory must be a positive number above 0" }
    ),
  store_id: validate.number({ required_error: "Store ID is required" }),
  type: validate.enum(["PERCENTAGE", "NOMINAL", "BOGO"], {
    required_error: "Discount type is required",
  }),
  value: validate
    .number()
    .nonnegative("Value must be a non-negative number")
    .optional(),
  min_purchase: validate
    .number()
    .nonnegative("Minimum purchase must be a non-negative number")
    .optional(),
  max_discount: validate
    .number()
    .nonnegative("Maximum discount must be a non-negative number")
    .optional(),
  bogo_product_id: validate.number().optional(), // Required for BOGO if applicable
  description: validate
    .string()
    .min(1, "Description is required")
    .max(255, "Description must not exceed 255 characters"),
  is_active: validate.boolean().optional().default(true), // Default active state
  start_date: validate.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start date format",
  }),
  end_date: validate.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end date format",
  }),
});

export const updateDiscountSchema = discountSchema.partial();
