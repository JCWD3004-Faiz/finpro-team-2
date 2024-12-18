import { z as validate } from "zod";

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
  product_image: validate
    .array(validate.string()) 
    .nonempty({ message: "At least one product image is required" }) 
    .refine((images) => images.every((image) => image.trim().length > 0), {
      message: "Image URLs must be valid and non-empty strings",
    }),
});
