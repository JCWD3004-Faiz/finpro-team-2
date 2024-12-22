import { Response } from "express";
import { ZodError } from "zod";
import { parseZodError } from "./zod.utils";

interface ApiResponseOptions {
  success?: boolean;
  statusCode: number;
  message: string;
  data?: any;
  detail?: string | string[];
}

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  detail?: string
) => {
  res.status(statusCode).send({
    success: false,
    status: statusCode,
    message,
    detail,
  });
};
export const sendResponse = (res: Response, options: ApiResponseOptions) => {
  const { success = true, statusCode, message, data, detail } = options;

  const responsePayload: any = { success, status: statusCode, message };
  if (data !== undefined) responsePayload.data = data;
  if (detail)
    responsePayload.detail = Array.isArray(detail) ? detail : [detail];

  res.status(statusCode).send(responsePayload);
};

/**
 * Handles Zod validation errors and sends a standardized error response.
 * @param res Express Response object
 * @param error ZodError instance
 */
export const sendZodErrorResponse = (res: Response, error: ZodError) => {
  const parsedErrors = parseZodError(error);
  sendResponse(res, {
    success: false,
    statusCode: 400,
    message: "Validation failed",
    detail: parsedErrors,
  });
};
