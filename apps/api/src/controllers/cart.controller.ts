import { Request, Response } from "express";
import { CartService } from "../services/cart.service";

export class CartController {
    private cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }

    async addToCart(req: Request, res: Response): Promise<void> {
        const { user_id, inventory_id } = req.body;
        const data = await this.cartService.addToCart(user_id, inventory_id);
        if (data && !data.error) {
            const cartPrice = await this.cartService.updateCartPrice(user_id);
            if (cartPrice && !cartPrice.error) {
                res.status(200).send({
                message: "Successfully added to cart", status: res.statusCode,
            });
            } else {
                res.status(400).send({
                    message: "Failed to update cart price", status: res.statusCode,
                });
            }
        } else {
            res.status(400).send({
                message: data?.error || "Failed to add item to cart",
                status: res.statusCode,
            });
        }
    }

    async changeItemQuantity(req: Request, res: Response): Promise<void> {
        const { user_id, cart_item_id, quantity } = req.body;
        const data = await this.cartService.changeItemQuantity(user_id, cart_item_id, quantity);
        if (data && !data.error) {
            const cartPrice = await this.cartService.updateCartPrice(user_id);
            if (cartPrice && !cartPrice.error) {
                res.status(200).send({
                message: "Successfully updated item quantity",
                status: res.statusCode, cart_item: data.cart_item,
            });
            } else {
                res.status(400).send({
                    message: "Failed to update cart price", status: res.statusCode,
                });
            }
        } else {
            res.status(400).send({
                message: "Failed to update item quantity", status: res.statusCode,
            });
        }
    }

    async getCartItems(req: Request, res: Response): Promise<void> {
        const user_id = parseInt(req.params.user_id);
        const data = await this.cartService.getCartItems(user_id);
        if (data &&!data.error) {
            res.status(200).send({
                message: "Cart items retrieved successfully",
                status: res.statusCode, cart_data: data,
            });
        } else {
            res.status(400).send({
                message: "Failed to retrieve cart items", status: res.statusCode,
            });
        }
    }

    async removeCartItem(req: Request, res: Response): Promise<void> {
        const user_id = parseInt(req.params.user_id);
        const cart_item_id = parseInt(req.params.cart_item_id);
        const data = await this.cartService.removeCartItem(user_id, cart_item_id);
        if (data && !data.error) {
            const cartPrice = await this.cartService.updateCartPrice(user_id);
            if (cartPrice && !cartPrice.error){
                res.status(200).send({
                message: "Successfully removed item from cart",
                status: res.statusCode,
            });
            } else {
                res.status(400).send({
                    message: "Failed to update cart price", status: res.statusCode,
                });
            }
        } else {
            res.status(400).send({
                message: "Failed to remove item from cart", status: res.statusCode,
            });
        }
    }

    async checkoutCart(req: Request, res: Response): Promise<void> {
        const user_id = parseInt(req.params.user_id);
        const data = await this.cartService.checkoutCart(user_id);
        if (data &&!data.error) {
            res.status(200).send({
                message: "Successfully checked out cart",
                status: res.statusCode, data: data
            });
        } else {
            res.status(400).send({
                message: "Failed to checkout cart", status: res.statusCode,
            });
        }
    }
    
}
