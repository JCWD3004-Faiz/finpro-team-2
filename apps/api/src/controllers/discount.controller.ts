import { Request, Response } from "express";
import { DiscountService } from "../services/discount.service";
import { CreateDiscount } from "../models/discount.models";
import {
  sendErrorResponse,
  sendZodErrorResponse,
} from "../utils/response.utils";
import { ZodError } from "zod";

export class DiscountController {
  private discountService: DiscountService;
  constructor() {
    this.discountService = new DiscountService();
  }

  async createDiscount(req: Request, res: Response) {
    try {
      const store_id = parseInt(req.params.store_id);
      if (isNaN(store_id)) {
        throw new Error("Invalid store_id provided.");
      }
      const imageFile: string = (req as any).file?.path || "";
      const {
        inventory_id,
        type,
        value,
        min_purchase,
        max_discount,
        bogo_product_id,
        description,
        start_date,
        end_date,
      } = req.body;

      const discountData = {
        store_id,
        inventory_id,
        type,
        value: value ? parseFloat(value) : undefined,
        min_purchase: min_purchase ? parseFloat(min_purchase) : undefined,
        max_discount: max_discount ? parseFloat(max_discount) : undefined,
        bogo_product_id: bogo_product_id
          ? parseInt(bogo_product_id)
          : undefined,
        description,
        start_date,
        end_date,
        image: imageFile,
      };
      const newDiscount =
        await this.discountService.createDiscount(discountData);
      res.status(201).send({
        message: "Discount created successfully",
        status: res.statusCode,
        data: newDiscount,
      });
    } catch (error) {
      const err = error as Error;
      if (error instanceof ZodError) {
        sendZodErrorResponse(res, error);
      } else {
        sendErrorResponse(res, 400, "Failed to create discount", err.message);
      }
    }
  }
}
