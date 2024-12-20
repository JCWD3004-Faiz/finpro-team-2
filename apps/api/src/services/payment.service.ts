import { PrismaClient } from "@prisma/client";
import { Payment, PaymentStatus } from "../models/all.models";
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
            if (!order) { return { error: "Order not found or does not belong to the user." }}
            let popImageUrl: string | null = null;            
            if (data.pop_image) {
                const uploadResponse = await cloudinary.uploader.upload(
                    data.pop_image, { folder: "proof_of_payment"}
                ); popImageUrl = uploadResponse.secure_url;
            }
            const transaction_id = await this.generateTransactionId();
            const payment = await this.prisma.payments.create({
                data: {
                    order_id: order_id, transaction_id: transaction_id,
                    total_price: order.cart_price.add(order.shipping_price),
                    payment_method: data.payment_method, payment_date: data.payment_date,
                    pop_image: popImageUrl,
                }
            });
            await this.prisma.orders.update({ where: { order_id: order_id }, data: { order_status: "AWAITING_CONFIRMATION" }});
            return { message: "Payment created successfully.", payment };
        } catch (error) {
            console.error("Error creating payment:", error);
            return { error: "Failed to create payment." };
        }
    }

    async getPaymentById(store_id: number, payment_id: number) {
        try {
            const payment = await this.prisma.payments.findUnique({
                where: { payment_id: payment_id },
                include: { Order: { include: { Store: true } } }
            });
            if (!payment || payment.Order?.store_id !== store_id) {
                return { error: "Payment not found or does not belong to the store." };
            }
            return { message: "Payment found", payment };
        } catch (error) {
            console.error("Error fetching payment:", error);
            return { error: "Failed to fetch payment." };
        }
    }

    async changePaymentStatus(store_id: number, payment_id: number, payment_status: PaymentStatus) {
        try {
            const payment = await this.prisma.payments.findUnique({
                where: { payment_id: payment_id },
                include: { Order: { include: { Store: true } } },
            });    
            if (!payment || payment.Order?.store_id !== store_id) {
                return { error: "Payment not found or does not belong to the store." };
            }    
            const updatedPayment = await this.prisma.payments.update({
                where: { payment_id: payment_id },
                data: { payment_status: payment_status },
            });    
            if (payment_status === "COMPLETED") {
                await this.prisma.orders.update({
                    where: { order_id: payment.Order.order_id },
                    data: { order_status: "PROCESSING" },
                });
            }
            if (payment_status === "FAILED" && "CANCELLED") {
                await this.prisma.orders.update({
                    where: { order_id: payment.Order.order_id },
                    data: { order_status: "CANCELLED" },
                });
            }
            return { message: "Payment and order status updated successfully.", updatedPayment };
        } catch (error) {
            console.error("Error updating payment status:", error);
            return { error: "Failed to update payment status." };
        }
    }

    async getUserPaymentHistory(user_id: number) {
        try {
            const orders = await this.prisma.orders.findMany({
                where: {user_id: user_id, order_status: { in: ["ORDER_CONFIRMED", "CANCELLED"]}},
                include: { 
                    Payments: true, 
                    Store: { select: { store_name: true } },
                    Address: { select: { address: true, city_name: true } },
                },
            });
            const payments = orders.flatMap(order => order.Payments);
            if (payments.length === 0) { return { error: "No payments found for this user." }}
            return { payments: orders.map(history => ({
                transaction_id: history.Payments?.transaction_id,
                store_name: history.Store.store_name, 
                order_status: history.order_status,
                total_price: history.Payments?.total_price, 
                shipping_method: history.shipping_method,
                payment_method: history.Payments?.payment_method,
                payment_date: history.Payments?.payment_date
            }))};
        } catch (error) {
            console.error("Error fetching payment history:", error);
            return { error: "Failed to fetch payment history." };
        }
    }

    async getUserPaymentDetails(user_id: number, payment_id: number){
        try {
            const payment = await this.prisma.payments.findUnique({
                where: { payment_id: payment_id },
                include: { Order: { include: { User: true } } }
            });
            if (!payment || payment.Order?.user_id !== user_id) {
                return { error: "Payment not found or does not belong to this user." };
            }
            return { message: "Payment found", payment };
        } catch (error) {
            console.error("Error fetching payment:", error);
            return { error: "Failed to fetch payment." };
        }
    }

    async getUserItemDetails(userId: number, transaction_id: string) {
        try {
            const payment = await this.prisma.payments.findUnique({
                where: { transaction_id: transaction_id },
                include: {Order: {include: {Cart: {include: {CartItems: {include: {Inventory: {include: {Product: true}}}}}}}}}
            });    
            if (!payment || payment.Order?.user_id !== userId) {
                return { error: "Payment not found or does not belong to this user." };
            }
            const cartItemsWithProductDetails = payment.Order.Cart.CartItems.map(item => ({
                cart_item_id: item.cart_item_id, quantity: item.quantity,
                product_price: item.product_price, product_name: item.Inventory.Product.product_name,
            }));    
            return { message: "Items found", cartItems: cartItemsWithProductDetails };
        } catch (error) {
            console.error("Error fetching user item details:", error);
            return { error: "Failed to fetch user item details." };
        }
    }

    async getStoreItemDetails(store_id: number, order_id: number) {
        try {
            const order = await this.prisma.orders.findUnique({
                where: { order_id: order_id },
                include: {Cart: {include: {CartItems: {include: {Inventory: {include: {Product: true}}}}}},
                    Store: true,
                },
            });
            if (!order || order.Store?.store_id !== store_id) {
                return { error: "Order not found or does not belong to the store." };
            }
            const cartItemsWithProductDetails = order.Cart.CartItems.map(item => ({
                cart_item_id: item.cart_item_id, quantity: item.quantity,
                product_price: item.product_price, stock_available: item.Inventory.stock,
                product_name: item.Inventory.Product.product_name,
            }));
            return { message: "Items found", cartItems: cartItemsWithProductDetails };
        } catch (error) {
            console.error("Error fetching store item details:", error);
            return { error: "Failed to fetch store item details." };
        }
    }
}
