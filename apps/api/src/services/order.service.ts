import { PrismaClient } from "@prisma/client";
import { ShippingMethod } from "../models/all.models";

export class OrderService {
    private prisma: PrismaClient = new PrismaClient();

    async getAllOrders() {
        return this.prisma.orders.findMany();
    }

    async getOrderById(user_id: number, order_id: number) {
        try {
            const order = await this.prisma.orders.findFirst({
                where: { order_id: order_id, user_id: user_id},
                include: {
                    Store: { select: { store_name: true } },
                    Address: { select: { address: true, city_name: true } },
                    Cart: { select: { cart_price: true } },
                },
            });
            if (!order) {return { error: "Order not found or user does not own this order." }}
            return {
                order: {
                    store_name: order.Store.store_name, address: order.Address.address,
                    city_name: order.Address.city_name, order_status: order.order_status,
                    shipping_method: order.shipping_method, created_at: order.created_at,
                },
            };
        } catch (error) {
            console.error("Error fetching order:", error);
            return { error: "Failed to fetch order." };
        }
    }

    async getUserOrders(user_id: number) {
        try {
            const orders = await this.prisma.orders.findMany({
                where: {user_id: user_id, order_status: { 
                    in: ["AWAITING_CONFIRMATION", "PENDING_PAYMENT", "PROCESSING", "SENT"]
                }},
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

    async changeOrderAddress(user_id: number, order_id: number, address_id: number) {
        try {
            const order = await this.prisma.orders.findFirst({
                where: { order_id: order_id, user_id: user_id},
            });

            if (!order) { return { error: "Order not found or user does not own this order." }}
            const updatedOrder = await this.prisma.orders.update({
                where: { order_id }, data: { address_id }, 
            });
            return { message: "Order address updated successfully.", updatedOrder };
        } catch (error) {
            console.error("Error updating order address:", error);
            return { error: "Failed to update order address." };
        }
    }

    async changeOrderMethod(user_id: number, order_id: number, shipping_method: ShippingMethod) {
        try {
            const order = await this.prisma.orders.findFirst({
                where: { order_id: order_id, user_id: user_id},
            });
            if (!order) { return { error: "Order not found or user does not own this order." }}
            const updatedOrder = await this.prisma.orders.update({
                where: { order_id }, data: { shipping_method: shipping_method },
            });
            return { message: "Order method updated successfully.", updatedOrder };
        } catch (error) {
            console.error("Error updating order address:", error);
            return { error: "Failed to update order address." };
        }
    }

    async processOrder(store_id: number, order_id: number) {
        try {
            const order = await this.prisma.orders.findFirst({
                where: { order_id: order_id, store_id: store_id },
                include: { Cart: { include: { CartItems: { include: { Inventory: true } } } } }
            });
            if (!order) { return { error: "Order not found." } }
            if (order.order_status !== "PROCESSING") {
                return { error: "Order cannot be processed as it is not in PROCESSING state." };
            }
            const cart = order.Cart;
            if (!cart) { return { error: "Cart not found." } }
            for (const cartItem of cart.CartItems) {
                const inventory = cartItem.Inventory;
                if (!inventory) { return { error: `Inventory not found for id: ${cartItem.inventory_id}` } }
                if (inventory.user_stock === null || inventory.user_stock < cartItem.quantity) {
                    return { error: `Not enough stock for id: ${cartItem.inventory_id}` };
                }
            }
            for (const cartItem of cart.CartItems) {
                const inventory = cartItem.Inventory;
                if (!inventory) continue;
                await this.prisma.inventories.update({
                    where: { inventory_id: inventory.inventory_id },
                    data: {
                        items_sold: { increment: cartItem.quantity },
                        user_stock: { decrement: cartItem.quantity },
                    },
                });
            }
            return { message: "Inventory updated successfully."};
        } catch (error) {
            console.error("Error updating inventory:", error);
            return { error: "Failed to update inventory." };
        }
    }

    async sentOrder(order_id: number) {
        try {
            const updatedOrder = await this.prisma.orders.update({
                where: { order_id }, data: { order_status: "SENT" },
            });
            setTimeout(async () => {
                await this.prisma.orders.update({
                    where: { order_id }, data: { order_status: "ORDER_CONFIRMED" },
                });
            }, 604800000);
            return { message: "Order status updated to SENT.", updatedOrder };
        } catch (error) {
            console.error("Error updating order to SENT:", error);
            return { error: "Failed to update order status to SENT." };
        }
    }

    async confirmUserOrder(user_id: number, order_id: number) {
        const order = await this.prisma.orders.findFirst({
            where: { order_id: order_id, user_id: user_id },
        });
        if (!order) { return { error: "Order not found or user does not own this order." } }
        if (order.order_status !== "SENT") {
            return { error: "Order cannot be confirmed as it is not in SENT state." };
        }
        const updatedOrder = await this.prisma.orders.update({
            where: { order_id }, data: { order_status: "ORDER_CONFIRMED" },
        });
        return { message: "Order confirmed successfully.", updatedOrder };
    }

    async cancelUserOrder(user_id: number, order_id: number) {
        const order = await this.prisma.orders.findFirst({
            where: { order_id: order_id, user_id: user_id },
        });
        if (!order) { return { error: "Order not found or user does not own this order." } }
        if (order.order_status !== "PENDING_PAYMENT") {
            return { error: "Order cannot be cancelled as it is not in PENDING_PAYMENT state." };
        }
        const updatedOrder = await this.prisma.orders.update({
            where: { order_id }, data: { order_status: "CANCELLED" },
        });
        return { message: "Order cancelled successfully.", updatedOrder };
    }
}
