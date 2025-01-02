import { z as validate } from "zod";

export const userRegisterSchema = validate.object({
  username: validate.string().min(1, "Username is required").max(30, "Maximum is 50 characters"),
  email: validate.string().email("invalid email address"),
  password_hash: validate.string().min(6, "password must be at least 6 characters long"),
  /* role: validate.enum(["USER"]).refine((val) => val === "USER", {
    message: "Invalid role, only 'USER' is allowed.",
  }), */
});

export const userPendingSchema = validate.object({
  username: validate.string().min(1, "Username is required").max(50, "Maximum is 50 characters"),
  email: validate.string().email("invalid email address"),
})

export const authScehma = validate.object({
  email: validate.string().email("invalid email address"),
  password: validate.string().min(6, "password must be at least 6 characters long"),
})

export const resetPasswordSchema = validate.object({
  email: validate.string().email("invalid email address"),
})