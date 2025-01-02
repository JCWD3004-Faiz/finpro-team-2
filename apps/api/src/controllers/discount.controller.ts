import { Request, Response } from "express";
import { DiscountService } from "../services/discount.service";
import { CreateDiscount, UpdateDiscount } from "../models/discount.models";
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

  async updateDiscount(req: Request, res: Response){
    try {
      const discount_id = parseInt(req.params.discount_id);
      if (isNaN(discount_id)) {
        throw new Error("Invalid discount_id provided.");
      }
      const data: UpdateDiscount = req.body
      const updatedDiscount = await this.discountService.updateDiscount(discount_id, data);
      res.status(201).send({
        message: "Discount updated successfully",
        status: res.statusCode,
        data: updatedDiscount,
      });
    } catch (error) {
      const err = error as Error;
      if (error instanceof ZodError) {
        sendZodErrorResponse(res, error);
      } else {
        sendErrorResponse(res, 400, "Failed to update discount", err.message);
      }
    }
  }

  async deleteDiscount(req: Request, res: Response){
    try {
      const discount_id = parseInt(req.params.discount_id);
      if (isNaN(discount_id)) {
        throw new Error("Invalid discount_id provided.");
      }
      const deleteDiscount = await this.discountService.deleteDiscount(discount_id);
      res.status(201).send({
        message: "Discount deleted successfully",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, "Failed to delete discount", err.message);
    }
  }

  async updateDiscountImage(req: Request, res: Response){
    try {
      if (!req.file) {
        throw new Error("no file uploaded");
      }
      const discount_id = parseInt(req.params.discount_id);
      const image: string = (req as any).file?.path || "";
      await this.discountService.updateDiscountImage(discount_id, image);
      res.status(201).send({
        message: "image updated successfully",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, "Failed to update discount image", err.message);
    }
  }
}
