import { z as validate } from "zod";

export const adminRegisterSchema = validate.object({
    username: validate.string().min(1, "Username is required"),
    email: validate.string().email("Invalid email address"),
    password_hash: validate.string().min(6, "Password must be at least 6 characters long"),
    role: validate.enum(["STORE_ADMIN"]).refine((val) => val === "STORE_ADMIN", {
        message: "Invalid role, only 'STORE_ADMIN' is allowed.",
    }),
});
