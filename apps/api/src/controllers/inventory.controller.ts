import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { sendErrorResponse } from "../utils/response.utils";

export class InventoryController {
  private inventoryService: InventoryService;
  constructor() {
    this.inventoryService = new InventoryService();
  }

  async superAdminCreateStockJournal(req: Request, res: Response) {
    try {
      const store_id = parseInt(req.params.store_id);
      const { inventories } = req.body;
      if (!Array.isArray(inventories) || inventories.length === 0) {
        return sendErrorResponse(res, 400, `Invalid inventories data. It must be a non-empty array.`);
      }
      if(inventories[0].stockChange === 0){
        return sendErrorResponse(res, 400, `Invalid inventories data. stock change can't be 0.`);
      }
      const stockJournals = await this.inventoryService.superAdminCreateStockJournal(store_id, inventories);
      //await this.inventoryService.superAdminCreateStockJournal(store_id);
      res.status(201).send({
        message: "Successfully updated stock journal",
        status: res.statusCode,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to create stock journal`, err.message);
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

  async getInventoriesByStoreId(req: Request, res: Response){
    try {
      const storeId = parseInt(req.params.store_id);
      if(isNaN(storeId)){
        return sendErrorResponse(res, 400, `Invalid store ID provided`);
      }

      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sortField = (req.query.sortField as string) || "stock";
      const sortOrder = (req.query.sortOrder as string) || "asc";
      const search = (req.query.search as string) || "";

      const inventories = await this.inventoryService.getInventoriesByStoreId(
        storeId,
        page,
        pageSize,
        sortField as "stock" | "product_name" | "items_sold",
        sortOrder as "asc" | "desc",
        search,
      );
      res.status(201).send({
        message: "Get inventories successfull",
        status: res.statusCode,
        data: inventories
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to get Inventories for the store ID`, err.message);
    }
  }
}
