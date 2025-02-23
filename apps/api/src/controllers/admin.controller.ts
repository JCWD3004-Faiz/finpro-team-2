import { Response } from 'express';
import { AdminService } from '../services/admin.service';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';

export class AdminController {
  constructor(private adminService: AdminService) {}

  // Cashier Management
  async createCashier(req: AuthRequest, res: Response) {
    try {
      const cashier = await this.adminService.createCashier(req.body);
      return res.status(201).json(successResponse(cashier));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getCashiers(req: AuthRequest, res: Response) {
    try {
      const { search } = req.query;
      const cashiers = await this.adminService.getCashiers(search as string);
      return res.json(successResponse(cashiers));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async updateCashier(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const cashier = await this.adminService.updateCashier(Number(id), req.body);
      return res.json(successResponse(cashier));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async deleteCashier(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      await this.adminService.deleteCashier(Number(id));
      return res.json(successResponse({ message: 'Cashier deleted successfully' }));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  // Sales Reports
  async getDailySalesReport(req: AuthRequest, res: Response) {
    try {
      const { date } = req.query;
      const report = await this.adminService.getDailySalesReport(date as string);
      return res.json(successResponse(report));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getProductSalesReport(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await this.adminService.getProductSalesReport(
        startDate as string,
        endDate as string
      );
      return res.json(successResponse(report));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getShiftSalesReport(req: AuthRequest, res: Response) {
    try {
      const { date } = req.query;
      const report = await this.adminService.getShiftSalesReport(date as string);
      return res.json(successResponse(report));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getInconsistentTransactions(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const report = await this.adminService.getInconsistentTransactions(
        startDate as string,
        endDate as string
      );
      return res.json(successResponse(report));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }
}