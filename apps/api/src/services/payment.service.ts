import { PrismaClient } from "@prisma/client";
import { Payment } from "../models/all.models";
import cloudinary from "../config/cloudinary";

export class PaymentService {
    private prisma: PrismaClient = new PrismaClient();
    
    private async generateTransactionId(): Promise<string> {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let transactionId = '';
        let isUnique = false;
        while (!isUnique) {
            transactionId = '';
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                transactionId += characters[randomIndex];
            }
            const existingPayment = await this.prisma.payments.findUnique({
                where: { transaction_id: transactionId },
            });
            if (!existingPayment) {
                isUnique = true;
            }
        }
        return transactionId;
    }

    async createPayment(user_id: number, order_id: number, data: Payment) {
        try {
            const order = await this.prisma.orders.findFirst({
                where: { order_id: order_id, user_id: user_id }
            });
            if (!order) {
                return { error: "Order not found or does not belong to the user." };
            }
            let popImageUrl: string | null = null;            
            if (data.pop_image) {
                const uploadResponse = await cloudinary.uploader.upload(
                    data.pop_image,
                    {
                        folder: "proof_of_payment",
                    }
                );
                popImageUrl = uploadResponse.secure_url;
            }
            console.log("Data",data)
            const transaction_id = await this.generateTransactionId();
            const payment = await this.prisma.payments.create({
                data: {
                    order_id: order_id,
                    transaction_id: transaction_id,
                    total_price: order.cart_price.add(order.shipping_price),
                    payment_method: data.payment_method,
                    payment_date: data.payment_date,
                    pop_image: popImageUrl,
                }
            });
            return { message: "Payment created successfully.", payment };
        } catch (error) {
            console.error("Error creating payment:", error);
            return { error: "Failed to create payment." };
        }
    }
}
