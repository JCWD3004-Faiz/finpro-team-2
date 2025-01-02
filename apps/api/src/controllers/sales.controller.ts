import { Request, Response } from "express";
import { SalesService } from "../services/sales.service";
import { sendErrorResponse } from "../utils/response.utils";

export class SalesController {
  private salesService: SalesService;
  constructor() {
    this.salesService = new SalesService();
  }

  async getMonthlySalesReport(req: Request, res: Response) {
    try {
      const year = parseInt(req.query.year as string);
      if (isNaN(year)) {
        res.status(400).send({
          message: "Invalid year provided",
          status: 400,
        });
      }
      const storeId = req.query.store_id
        ? parseInt(req.query.store_id as string)
        : undefined;

      const salesData = await this.salesService.getMonthlySalesReport(
        year,
        storeId
      );
      res.status(200).send({
        message: "Sales report fetched successfully",
        status: res.statusCode,
        data: salesData,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to get sales data`, err.message);
    }
  }

  async getMonthlySalesByCategory(req: Request, res: Response) {
    try {
      const year = parseInt(req.query.year as string);
      if (isNaN(year)) {
        res.status(400).send({
          message: "Invalid year provided",
          status: 400,
        });
      }

      // Parse optional store_id and category_id filters
      const storeId = req.query.store_id
        ? parseInt(req.query.store_id as string)
        : undefined;
      const categoryId = req.query.category_id
        ? parseInt(req.query.category_id as string)
        : undefined;

      // Fetch the sales data by category
      const salesData = await this.salesService.getMonthlySalesByCategory(
        year,
        storeId,
        categoryId
      );

      // Respond with the fetched data
      res.status(200).send({
        message: "Sales by category report fetched successfully",
        status: res.statusCode,
        data: salesData,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(
        res,
        400,
        `Failed to get sales data by category`,
        err.message
      );
    }
  }

  async getMonthlySalesByProduct(req: Request, res: Response) {
    try {
      // Parse and validate year
      const year = parseInt(req.query.year as string);
      if (isNaN(year)) {
        res.status(400).send({
          message: "Invalid year provided",
          status: 400,
        });
      }
  
      const storeId = req.query.store_id
        ? parseInt(req.query.store_id as string)
        : undefined;
      const productId = req.query.product_id
        ? parseInt(req.query.product_id as string)
        : undefined;
  
      const salesData = await this.salesService.getMonthlySalesByProduct(
        year,
        storeId,
        productId
      );
  
      // Send response
      res.status(200).send({
        message: "Product sales report fetched successfully",
        status: res.statusCode,
        data: salesData,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, "Failed to get product sales data", err.message);
    }
  }
  
}
