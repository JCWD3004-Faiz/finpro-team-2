import { Request, Response } from "express";
import MidtransService from "../services/midtrans.service";

export default class MidtransController {
    private midtransService: MidtransService;

    constructor() {
        this.midtransService = new MidtransService();
    }

    public async createVABankTransfer(req: Request, res:Response): Promise<any> {
        const { transaction_details, customer_details, credit_card, shipping_details } = req.body;

        if(!transaction_details || !credit_card || !customer_details) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        try {
            const response = await this.midtransService.createVABankTransfer({
                transaction_details,
                customer_details,
                credit_card,
                shipping_details
            })
            return res.status(200).json(response);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });            
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