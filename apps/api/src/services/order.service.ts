import { PrismaClient } from "@prisma/client";
import { ShippingMethod } from "../models/all.models";

export class OrderService {
    private prisma: PrismaClient = new PrismaClient();

    async getAllOrders() {
        return this.prisma.orders.findMany();
    }

    async getOrderById (order_id: number){
        return this.prisma.orders.findUnique({
          where: { order_id: order_id},
        });
    }

    async getUserOrders(user_id: number) {
        try {
            const orders = await this.prisma.orders.findMany({
                where: { user_id },
                include: {
                    Cart: { select: { cart_price: true } },
                    Store: { select: { store_name: true } },
                    Address: { select: { address: true, city_name: true } },
                },
            });
            if (!orders.length) return { message: "No orders found for this user." };
            return { orders: orders.map(order => ({
                store_name: order.Store.store_name, address: order.Address.address,
                city_name: order.Address.city_name, order_status: order.order_status,
                cart_price: order.Cart.cart_price, shipping_method: order.shipping_method,
                shipping_price: order.shipping_price, created_at: order.created_at
            }))};
        } catch (error) {
            console.error("Error fetching orders:", error);
            return { error: "Failed to fetch orders" };
        }
    }

    async getStoreOrders(store_id: number) {
        try {
            const orders = await this.prisma.orders.findMany({
                where: { store_id },
                include: {
                    Cart: { select: { cart_price: true } },
                    Address: { select: { address: true, city_name: true } },
                    User: { select: { username: true } },
                },
            });
            if (orders.length === 0) return { message: "No orders found for this store." };
            return { orders: orders.map(order => ({
                username: order.User.username, address: order.Address.address,
                city_name: order.Address.city_name, order_status: order.order_status,
                cart_price: order.Cart.cart_price, shipping_method: order.shipping_method,
                shipping_price: order.shipping_price, created_at: order.created_at
            }))};
        } catch (error) {
            console.error("Error fetching orders by store ID:", error);
            return { error: "Failed to fetch orders" };
        }
    }

    async changeOrderAddress(order_id: number, address_id: number) {
        try {
            const updatedOrder = await this.prisma.orders.update({
                where: { order_id },
                data: { address_id }, 
            });
            return { message: "Order address updated successfully.", updatedOrder };
        } catch (error) {
            console.error("Error updating order address:", error);
            return { error: "Failed to update order address." };
        }
    }

    async changeOrderMethod(order_id: number, shipping_method: ShippingMethod) {
        try {
            const updatedOrder = await this.prisma.orders.update({
                where: { order_id },
                data: { shipping_method: shipping_method },
            });
            return { message: "Order address updated successfully.", updatedOrder };
        } catch (error) {
            console.error("Error updating order address:", error);
            return { error: "Failed to update order address." };
        }
    }
}
