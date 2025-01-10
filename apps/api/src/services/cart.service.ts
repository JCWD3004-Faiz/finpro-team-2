import { PrismaClient } from "@prisma/client";
import { VoucherService } from "./voucher.service";
import axios from "axios";

export class CartService {
    private prisma: PrismaClient;
    private voucherService: VoucherService; 

    constructor() {
        this.prisma = new PrismaClient();
        this.voucherService = new VoucherService();
    }

    async addToCart(user_id: number, inventory_id: number) {
        try {
            let cart = await this.prisma.carts.findFirst({ where: { user_id, is_active: true } }) || 
                await this.prisma.carts.create({ data: { user_id, cart_price: 0, is_active: true } });
            const inventory = await this.prisma.inventories.findUnique({ where: { inventory_id } });
            if (!inventory) return { error: "Inventory item not found" };
            const existingCartItem = await this.prisma.cartItems.findFirst({ where: { cart_id: cart.cart_id, inventory_id } });
            if (existingCartItem) return { error: "This product is already in the cart" };
            const newCartItem = await this.prisma.cartItems.create({
                data: { cart_id: cart.cart_id, inventory_id, quantity: 1, product_price: inventory.discounted_price || 0 }
            });
            return { message: "Item added to cart", cart_item: newCartItem };
        } catch (error) {
            console.error("Error in adding item to cart:", error);
            return { error: "Failed to add item to cart" };
        }
    }

    async updateCartPrice(user_id: number) {
        try {
            const cart = await this.prisma.carts.findFirst({ where: { user_id, is_active: true }});    
            const { _sum: { product_price } } = await this.prisma.cartItems.aggregate({
                where: { cart_id: cart?.cart_id },  _sum: { product_price: true }
            });    
            let newCartPrice = Number(product_price || 0);
            const discountAmount = Number(cart?.discount_amount)
            if (cart?.discount_type && cart?.discount_amount != null) {
                if (cart.discount_type === "NOMINAL") {
                    newCartPrice = Math.max(newCartPrice - discountAmount, 0);
                } else if (cart.discount_type === "PERCENTAGE") {
                    const discount = (newCartPrice * discountAmount) / 100;
                    newCartPrice = Math.max(newCartPrice - discount, 0);
                }
            }    
            await this.prisma.carts.update({ where: { cart_id: cart?.cart_id }, data: { cart_price: newCartPrice }});
            return { message: "Cart price updated successfully" };
        } catch (error) {
            console.error("Error updating cart price:", error);
            return { error: "Failed to update cart price" };
        }
    }
        
    async changeItemQuantity(user_id: number, cart_item_id: number, quantity: number) {
        try {
            if (quantity <= 0) return { error: "Quantity must be greater than zero" };
            const cart = await this.prisma.carts.findFirst({ where: { user_id, is_active: true } });
            if (!cart) return { error: "Cart not found" };
            const cartItem = await this.prisma.cartItems.findUnique({where: { cart_item_id }, include: { Inventory: true }});
            if (!cartItem) return { error: "Cart item not found" };
            const discountAmount = Number(cartItem.discount_amount)
            const inventoryPrice = Number(cartItem.Inventory.discounted_price);    
            let updatedPrice = inventoryPrice * quantity;    
            if (cartItem.discount_type === "NOMINAL") {
                updatedPrice = Math.max(updatedPrice - discountAmount, 0);
            } else if (cartItem.discount_type === "PERCENTAGE") {
                const discount = (updatedPrice * discountAmount) / 100;
                updatedPrice = Math.max(updatedPrice - discount, 0);
            }
            const updatedCartItem = await this.prisma.cartItems.update({
                where: { cart_item_id }, data: { quantity, product_price: updatedPrice },
            });    
            return { message: "Item quantity and price updated successfully", cart_item: updatedCartItem };
        } catch (error) {
            console.error("Error updating item quantity:", error);
            return { error: "Failed to update item quantity" };
        }
    }

    async getCartItems(user_id: number) {
        try {
            const cart = await this.prisma.carts.findFirst({
                where: { user_id, is_active: true },
                include: { CartItems: { include: { Inventory: { include: { Product: true }}}}}
            });
            if (!cart) return { error: "Active cart not found" }
            return {
                cart_price: cart.cart_price,
                cart_items: cart.CartItems.map(item => ({
                    cart_item_id: item.cart_item_id, quantity: item.quantity, product_price: item.product_price,
                    product_name: item.Inventory.Product.product_name,
                }))
            };
        } catch (error) {
            return { error: "Failed to retrieve cart items" };
        }
    }

    async removeCartItem(user_id: number, cart_item_id: number) {
        try {
            const cart = await this.prisma.carts.findFirst({
                where: { user_id, is_active: true },
            });
            if (!cart) return { error: "Active cart not found" }
            const cartItem = await this.prisma.cartItems.findUnique({
                where: { cart_item_id }, include: { Cart: true }
            });
            if (!cartItem) return { error: "Cart item not found" };
            await this.prisma.cartItems.delete({ where: { cart_item_id } });
            return { message: "Cart item removed successfully" };
        } catch (error) {
            return { error: "Failed to remove cart item" };
        }
    }

    async checkoutCart(user_id: number) {
        try {
            const cart = await this.prisma.carts.findFirst({ where: { user_id, is_active: true }, 
                include: { CartItems: { include: { Inventory: true } } } });
            if (!cart || cart.CartItems.length === 0) return { error: "Active cart not found or empty" };
            const address = await this.prisma.address.findFirst({ where: { user_id, is_default: true } });
            if (!address) return { error: "No default address found" };
            const store = await this.prisma.stores.findUnique({ where: { store_id: cart.CartItems[0].Inventory.store_id } });
            if (!store) return { error: "Store not found" };
            const cartOrder = await this.prisma.orders.create({ 
                data: { cart_id: cart.cart_id, user_id, store_id: store.store_id, address_id: address.address_id,
                cart_price: cart.cart_price, shipping_method: "jne", shipping_price: 0} });
            const shipping_price = await this.calculateShippingPrice(cartOrder.order_id);
            await this.prisma.carts.update({ where: { cart_id: cart.cart_id }, data: { is_active: false } });
            const voucherResponse = await this.voucherService.sendCartVoucher(user_id, Number(cart.cart_price));
            return { message: "Cart checked out successfully", order: { ...cartOrder, shipping_price }, voucher: voucherResponse || null };
        } catch (error) {
            console.error("Error during checkout:", error);
            return { error: "Failed to checkout cart" };
        }
    }

    async calculateShippingPrice(order_id: number) {
        try {
            const order = await this.prisma.orders.findUnique({
                where: { order_id }, include: { Cart: { include: { CartItems: true } }, Address: true}
            });
            if (!order) throw new Error("Order not found");
            const totalWeight = order.Cart.CartItems.reduce((acc, item) => acc + item.quantity * 0.1, 0);
            const store = await this.prisma.stores.findUnique({ where: { store_id: order.store_id }, select: { city_id: true } });
            if (!store) throw new Error("Store not found");
            const payload = { origin: store.city_id, destination: order.Address.city_id, weight: totalWeight * 1000, courier: order.shipping_method };
            const response = await axios.post('https://api.rajaongkir.com/starter/cost', 
                payload, { headers: { key: process.env.RAJAONGKIR_API_KEY } });
            let newPrice = response.data.rajaongkir.results[0].costs[0].cost[0].value
            const discountAmount = Number(order.discount_amount)
            if (order.discount_type && order.discount_amount != null) {
                if (order.discount_type === "NOMINAL") {
                    newPrice = Math.max(newPrice - discountAmount, 0);
                } else if (order.discount_type === "PERCENTAGE") {
                    const discount = (newPrice * discountAmount) / 100;
                    newPrice = Math.max(newPrice - discount, 0);
                }
            }    
            await this.prisma.orders.update({ where: { order_id: order_id }, data: { shipping_price: newPrice } });
            return newPrice;
        } catch (error) {
            console.error("Error calculating shipping price:", error);
            throw new Error("Failed to calculate shipping price");
        }
    }
    
}
