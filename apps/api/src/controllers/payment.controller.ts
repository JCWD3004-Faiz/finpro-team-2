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
          if (response && !response.error) {
            res.status(201).send({
              message: "Payment created successfully",
              status: res.statusCode, data:response
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

    async getPaymentById(req: Request, res: Response) {
        try {
            const store_id = parseInt(req.params.store_id);
            const payment_id = parseInt(req.params.payment_id);
            const data = await this.paymentService.getPaymentById(store_id, payment_id);            
            if (data.error) {
                    res.status(404).send({
                    message: "Payment not found or does not belong to the store.",
                    status: res.statusCode,
                    error: data.error,
                });
            }            
            res.status(200).send({
                message: "Payment found",
                status: res.statusCode,
                data: data,
            });
        } catch (error) {
            if (!res.headersSent) {
                res.status(400).send({
                    message: `Payment not found`,
                    detail: (error as Error).message,
                    status: res.statusCode,
                });
            }
        }
    }

    async changePaymentStatus(req: Request, res: Response): Promise<void> {
        try {
            const store_id = parseInt(req.params.store_id);
            const payment_id = parseInt(req.params.payment_id);
            const payment_status = req.body.payment_status;    
            const data = await this.paymentService.changePaymentStatus(store_id, payment_id, payment_status);    
            if (data && !data.error) {
                res.status(200).send({
                    message: "Payment status updated successfully",
                    status: res.statusCode,
                    data: data,
                });
            }
        } catch (error) {
            res.status(400).send({
                message: `Error updating payment status`,
                detail: (error as Error).message,
                status: res.statusCode,
            });
        }
    }

    async getUserPaymentHistory(req: Request, res: Response) {
        try {
            const user_id = parseInt(req.params.user_id);
            const { page, limit, status } = req.query;    
            const pageNumber = page ? parseInt(page as string) : 1;
            const pageLimit = limit ? parseInt(limit as string) : 10;    
            const validStatuses = ["ORDER_CONFIRMED", "CANCELLED"];
            const statusFilter = validStatuses.includes(status as string) ? (status as "ORDER_CONFIRMED" | "CANCELLED") : undefined;
            const data = await this.paymentService.getUserPaymentHistory(user_id, pageNumber, pageLimit, statusFilter);
            if (data && !data.error) {
                res.status(200).send({
                    message: "Payment history found",
                    status: res.statusCode,
                    data: data,
                });
            } else {
                res.status(404).send({
                    message: "No payment history found",
                    status: res.statusCode,
                    error: data.error,
                });
            }
        } catch (error) {
            res.status(400).send({
                message: "Payment history not found",
                detail: (error as Error).message,
                status: res.statusCode,
            });
        }
    }

    async getUserPaymentDetails(req: Request, res: Response) {
        try {
            const user_id = parseInt(req.params.user_id);
            const order_id = parseInt(req.params.order_id);
            const data = await this.paymentService.getUserPaymentDetails(user_id, order_id);
            if (data.error) {
                    res.status(404).send({
                    message: "Payment not found or does not belong to the user.",
                    status: res.statusCode,
                    error: data.error,
                });
            }
            res.status(200).send({
                message: "Payment details found",
                status: res.statusCode,
                data: data,
            });
        } catch (error) {
            res.status(400).send({
                message: `Payment details not found`,
                detail: (error as Error).message,
                status: res.statusCode,
            });
        }
    }

    async getUserItemDetails(req: Request, res: Response) {
        let responseSent = false; 
        try {
            const user_id = parseInt(req.params.user_id);
            const { transaction_id } = req.body;
            const data = await this.paymentService.getUserItemDetails(user_id, transaction_id);
            if (data.error && !responseSent) {
                res.status(404).send({
                    message: "Item details not found",
                    status: res.statusCode, error: data.error,
                }); responseSent = true;
            }
            if (!data.error && !responseSent) {
                res.status(200).send({
                    message: "Item details found",
                    status: res.statusCode,  data: data,
                }); responseSent = true;
            }
        } catch (error) {
            if (!responseSent) {
                res.status(400).send({
                    message: "Item details not found",
                    detail: (error as Error).message, status: res.statusCode,
                }); responseSent = true;
            }
        }
    }

    async getStoreItemDetails(req: Request, res: Response) {
        try {
            const store_id = parseInt(req.params.store_id);
            const order_id = parseInt(req.params.order_id);
            const data = await this.paymentService.getStoreItemDetails(store_id, order_id);
            if (data.error) {
                    res.status(404).send({
                    message: "Order not found or does not belong to the store.",
                    status: res.statusCode, error: data.error,
                });
            } 
                res.status(200).send({
                message: "Item details found",
                status: res.statusCode, data: data,
            });
        } catch (error) {
            console.error("Error fetching store item details:", error);
                res.status(400).send({
                message: "Failed to fetch store item details.",
                detail: (error as Error).message, status: res.statusCode,
            });
        }
    }

    async getPaymentByIdSuper(req: Request, res: Response) {
        const payment_id = parseInt(req.params.payment_id);
        const data = await this.paymentService.getPaymentByIdSuper(payment_id);
        if (data.error) {
            res.status(404).send({
            message: "Payment not found.",
            status: res.statusCode, error: data.error,
            });
        }
            res.status(200).send({
            message: "Payment found",
            status: res.statusCode, data: data,
        });
    }

    async getSuperItemDetails(req: Request, res: Response) {
        const order_id = parseInt(req.params.order_id);
        const data = await this.paymentService.getSuperItemDetails(order_id);
        if (data.error) {
            res.status(404).send({
            message: "Order not found.",
            status: res.statusCode, error: data.error,
            });
        }
            res.status(200).send({
            message: "Item details found",
            status: res.statusCode, data: data,
        });
    }
}
