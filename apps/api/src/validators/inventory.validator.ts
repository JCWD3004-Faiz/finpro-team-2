import { z as validate } from "zod";

export const stockSchema = validate.object({
  stockChange: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > 0, {
      message: "Quantity must be a positive number above 0",
    }),
});

export const inventorySchema = validate.object({
  stock: validate
    .union([validate.string(), validate.number()])
    .transform((val) => parseFloat(val.toString()))
    .refine((val) => val > 0, {
      message: "Quantity must be a positive number above 0",
    }),
});
