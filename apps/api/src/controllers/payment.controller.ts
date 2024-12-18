import { Request, Response } from "express";
import { PaymentService } from "../services/payment.service";
import { Payment } from "../models/all.models";

function isErrnoException(error: unknown): error is NodeJS.ErrnoException {
    return (error as NodeJS.ErrnoException).code !== undefined;
  }

export class PaymentController {
    private paymentService: PaymentService;

    constructor() {
        this.paymentService = new PaymentService();
    }

    async createPayment(req: Request, res: Response) {
        try {
          const user_id = parseInt(req.params.user_id);
          const order_id = parseInt(req.params.order_id);
          const { payment_method, payment_date } = req.body;
          const pop_image = req.file?.path || "";
          const payment: Payment = {
            payment_method: payment_method,
            payment_date: payment_date,
            pop_image: String(pop_image),
          };      
          const response = await this.paymentService.createPayment(user_id, order_id, payment);
          console.log("response", response);
          if (response && !response.error) {
            res.status(201).send({
              message: "Payment created successfully",
              status: res.statusCode,
            });
          }
        } catch (error) {
          if (isErrnoException(error) && error.code === "LIMIT_FILE_SIZE") {
            res.status(400).send({
              message: "File size exceeds 2 MB limit",
            });
          }
          res.status(400).send({
            message: `Failed to create payment`,
            detail: (error as Error).message,
            status: res.statusCode,
          });
        }
      }
}
