import { z } from "zod";

export const manageProductSchema = z.object({
  category_id: z
    .number()
    .min(1, "Category ID is required and must be a positive number."),

  product_name: z
    .string()
    .min(1, "Product name is required.")
    .max(50, "Product name must not exceed 50 characters."),

  description: z
    .string()
    .min(1, "Product description is required.")
    .max(200, "Product description must not exceed 200 characters."),

  price: z.number().positive("Price must be a positive number."),

  images: z
    .array(z.instanceof(File))
    .min(1, "At least one product image is required.")
    .max(4, "You can upload up to 4 images only."),
});

export const validateProductData = (data: any) => {
  try {
    return manageProductSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.map((err) => err.message);
    }
    throw error;
  }
};
