import { Response } from 'express';
import { TransactionService } from '../services/transaction.service';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async createTransaction(req: AuthRequest, res: Response) {
    try {
      const { shiftId, items, paymentMethod, debitCardNumber } = req.body;
      const cashierId = req.user!.id;

      const transaction = await this.transactionService.createTransaction({
        shiftId,
        cashierId,
        items,
        paymentMethod,
        debitCardNumber
      });

      return res.status(201).json(successResponse(transaction));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getTransactionHistory(req: AuthRequest, res: Response) {
    try {
      const { startDate, endDate } = req.query;
      const cashierId = req.user!.id;

      const transactions = await this.transactionService.getTransactionHistory(
        cashierId,
        startDate as string,
        endDate as string
      );

      return res.json(successResponse(transactions));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getTransactionDetails(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const transaction = await this.transactionService.getTransactionDetails(Number(id));
      return res.json(successResponse(transaction));
    } catch (error: any) {
      return res.status(404).json(errorResponse(error.message));
    }
  }
}