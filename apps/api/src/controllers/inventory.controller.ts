import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { sendErrorResponse } from "../utils/response.utils";

export class InventoryController {
  private inventoryService: InventoryService;
  constructor() {
    this.inventoryService = new InventoryService();
  }

  async superAdminUpdateStock(req: Request, res: Response) {
    try {
      const inventoryId = parseInt(req.params.inventory_id);
      const { stockChange } = req.body;
      await this.inventoryService.superAdminUpdateStock(inventoryId, stockChange);
      res.status(201).send({
        message: "Successfully updated stock journal",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to update stock journal`, err.message);
    }
  }

  async storeAdminUpdateStock(req: Request, res: Response){
    try {
      const inventoryId = parseInt(req.params.inventory_id);
      const { stock } = req.body;
      await this.inventoryService.storeAdminUpdateStock(inventoryId, stock);
      res.status(201).send({
        message: "Successfully updated stock",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to update stock`, err.message);
    } 
  }
}
