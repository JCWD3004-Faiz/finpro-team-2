import { Request, Response } from "express";
import { StockService } from "../services/stock.service";
import { sendErrorResponse } from "../utils/response.utils";

export class StockController {
  private stockService: StockService;
  constructor() {
    this.stockService = new StockService();
  }

  async getStockJournalByStoreId(req: Request, res: Response) {
    try {
      const store_id = req.query.store_id
        ? parseInt(req.query.store_id as string)
        : undefined;
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;
      const sortOrder = (req.query.sortOrder as string) || "desc"; // Default sorting is descending
      const changeType = (req.query.changeType as string) || ""; // Optional filter for change_type
      const search = (req.query.search as string) || ""; // Optional filter for product name

      const stockJournal = await this.stockService.getStockJournalByStoreId(
        store_id,
        page,
        pageSize,
        sortOrder as "asc" | "desc",
        changeType,
        search // Pass the search query to the service
      );

      res.status(200).send({
        message: "Get stock journal successful",
        status: res.statusCode,
        data: stockJournal,
      });
    } catch (error) {
      const err = error as Error;
      sendErrorResponse(res, 400, `Failed to get stock journal`, err.message);
    }
  }
}
