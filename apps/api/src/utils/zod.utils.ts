import { ZodError } from "zod";

/**
 * Parses Zod validation errors into an array of readable messages.
 * @param error ZodError instance
 * @returns string[] Array of error messages
 */
export const parseZodError = (error: ZodError): string[] => {
  return error.errors.map((err) => {
    const path = err.path.join(".");
    return `${path}: ${err.message}`;
  });
};
