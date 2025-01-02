import { z as validate } from "zod";

// Shared validation schema for products
export const productSchema = validate.object({
  category_id: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > 0, {
      message: "Category ID can't be empty",
    }),
  product_name: validate
    .string()
    .min(1, "Product name is required")
    .max(50, "Maximum product name is 50 characters"),
  description: validate
    .string()
    .min(1, "Product description is required")
    .max(200, "Maximum product description is 200 characters"),
  price: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > 0, {
      message: "Price must be a positive number above 0",
    }),
});

// Partial schema for updates
export const updateProductSchema = productSchema.partial();
