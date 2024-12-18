import { z as validate } from "zod";

export const categorySchema = validate.object({
    category_name: validate.string().min(1, "Category name is required").max(50, "Maximum is 50 characters"),
})

