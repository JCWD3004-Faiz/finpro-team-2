import { Request, Response } from "express";
import MidtransService from "../services/midtrans.service";

export default class MidtransController {
    private midtransService: MidtransService;

    constructor() {
        this.midtransService = new MidtransService();
    }

    public async createVABankTransfer(req: Request, res:Response): Promise<any> {
        const { user_id, transaction_id } = req.body;
        try {
            const response = await this.midtransService.createVABankTransfer(user_id, transaction_id)
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });            
        }
    }

    public async updateMidtransPaymentStatus(req: Request, res: Response) {
        const { user_id, transaction_id } = req.body;
        try {
            const response = await this.midtransService.updateMidtransPaymentStatus(user_id, transaction_id)
            res.status(200).json(response);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });            
        }
    }

    public async getTransactionStatus(req: Request, res: Response): Promise<any> {
        const { orderId } = req.params
        try {
            const response = await this.midtransService.getTransactionStatus(orderId)
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });            
        }
    }
}