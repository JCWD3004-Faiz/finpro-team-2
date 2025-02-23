import { Response } from 'express';
import { ShiftService } from '../services/shift.service';
import { successResponse, errorResponse } from '../utils/response.utils';
import { AuthRequest } from '../middleware/auth.middleware';

export class ShiftController {
  constructor(private shiftService: ShiftService) {}

  async startShift(req: AuthRequest, res: Response) {
    try {
      const { initialCash } = req.body;
      const cashierId = req.user!.id;
      
      const shift = await this.shiftService.startShift(cashierId, initialCash);
      return res.json(successResponse(shift));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async endShift(req: AuthRequest, res: Response) {
    try {
      const { finalCash } = req.body;
      const cashierId = req.user!.id;
      
      const shift = await this.shiftService.endShift(cashierId, finalCash);
      return res.json(successResponse(shift));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }

  async getCurrentShift(req: AuthRequest, res: Response) {
    try {
      const cashierId = req.user!.id;
      const shift = await this.shiftService.getCurrentShift(cashierId);
      return res.json(successResponse(shift));
    } catch (error: any) {
      return res.status(404).json(errorResponse(error.message));
    }
  }

  async getShiftHistory(req: AuthRequest, res: Response) {
    try {
      const cashierId = req.user!.id;
      const shifts = await this.shiftService.getShiftHistory(cashierId);
      return res.json(successResponse(shifts));
    } catch (error: any) {
      return res.status(400).json(errorResponse(error.message));
    }
  }
}