import { z as zod } from "zod";

export const registerAdminSchema = zod.object({
    username: zod.string().min(1, "Username is required"),
    email: zod.string().email("Invalid email address"),
    password_hash: zod
    .string()
    .min(6, "Password must be at least 6 characters"),
});
