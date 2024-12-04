import { Response } from "express";

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