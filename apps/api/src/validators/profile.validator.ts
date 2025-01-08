import { z as validate } from "zod";

export const userPendingSchema = validate.object({
  username: validate.string().min(1, "Username is required").max(50, "Maximum is 50 characters").optional(),
  email: validate.string().email("invalid email address").optional(),
})