import { MidTransSnapRequest } from "../utils/midtransTypes";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import environment from "dotenv";

environment.config();

export default class MidtransService {
    private prisma: PrismaClient = new PrismaClient();
    private serverKey: string
    private apiURL: string

    constructor() {
        this.serverKey = process.env.MIDTRANS_SERVER_KEY as string;
        this.apiURL = process.env.MIDTRANS_API_URL as string;
    }

    public async createVABankTransfer(user_id: number, transaction_id: string) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        };
        try {
            const payment = await this.prisma.payments.findUnique({
                where: { transaction_id }, select: { total_price: true, payment_method:true, order_id:true },
            });
            if (!payment || payment.payment_method === "MANUAL_TRANSFER" ) {throw new Error("Payment not found")}    
            const user = await this.prisma.users.findUnique({
                where: { user_id }, select: { username: true, email: true },
            });
            if (!user) {throw new Error("User not found")}    
            const billing = await this.prisma.address.findFirst({
                where: { user_id, is_default: true },
                select: { address: true, city_name: true },
            });
            if (!billing) {throw new Error("Default address not found")}    
            const order_id = payment.order_id;    
            const order = await this.prisma.orders.findUnique({
                where: { order_id }, select: { address_id: true },
            });
            if (!order || !order.address_id) {throw new Error("Order address data not found")}
            const address_id = order.address_id;
            const shipping = await this.prisma.address.findUnique({
                where: { address_id }, select: { address: true, city_name: true },
            });
            if (!shipping) {throw new Error("Shipping address not found")}    
            const data: MidTransSnapRequest = {
                transaction_details: {
                    order_id: transaction_id,
                    gross_amount: Number(payment.total_price),
                },
                credit_card: {
                    secure: true,
                },
                customer_details: {
                    first_name: user.username,
                    email: user.email,
                    billing_address: {
                        address: billing.address,
                        city: billing.city_name,
                        country_code: "IDN",
                    },
                    shipping_address: {
                        first_name: user.username,
                        address: shipping.address,
                        city: shipping.city_name,
                        country_code: "IDN",
                    },
                },
            };
            await this.prisma.orders.update({ where: { order_id: order_id }, data: { order_status: "AWAITING_CONFIRMATION" }});
            const response = await axios.post(this.apiURL, data, { headers });
            await this.prisma.payments.update({where: {transaction_id: transaction_id}, data: { gateway_link: response.data.redirect_url}})
            return response.data;
        } catch (error) {
            console.error("Error creating VA: ", error);
            throw error;
        }
    }

    public async updateMidtransPaymentStatus(user_id: number, transaction_id: string) {
        try {
            const payment = await this.prisma.payments.findUnique({
                where: { transaction_id: transaction_id }, include: { Order: { include: { User: true }}}
            });    
            if (!payment || payment.Order?.user_id !== user_id || payment.payment_method !== "MIDTRANS") {
                return { error: "Payment not found or does not belong to this user." };
            }
            const transactionStatus = await this.getTransactionStatus(transaction_id);
            await this.prisma.orders.update({ where: { order_id: payment.order_id }, data: { order_status: "PROCESSING" }});
            const updatedStatus = await this.prisma.payments.update({
                where: { transaction_id: transaction_id },
                data: { payment_status: "COMPLETED", payment_reference: transactionStatus.transaction_id},
            });    
            return updatedStatus;
        } catch (error) {
            console.error("Error updating payment status: ", error);
            throw error;
        }
    }

    public async getTransactionStatus(transaction_id: string) {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Basic ${Buffer.from(this.serverKey + ':').toString('base64')}`,
        };
        try {
            const response = await axios.get(`https://api.sandbox.midtrans.com/v2/${transaction_id}/status`, { headers });
            return response.data;
        } catch (error) {
            console.error("Error getting transaction status: ", error);
            throw error;
        }
    }
}
