import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CartService } from "../services/cart.service";

export class OrderController {
    private orderService: OrderService;
    private cartService: CartService;

    constructor() {
        this.orderService = new OrderService();
        this.cartService = new CartService();
    }

    async getAllOrders(req: Request, res: Response){
        const order = await this.orderService.getAllOrders();
        if (order) {
          res.status(200).send ({
            data: order,
            status: res.statusCode,
          });
        } else {
          res.status(404).send({
            message: "Orders not found",
            status: res.statusCode,
            details: res.statusMessage,
          });
        }
    }

    async getOrderById(req: Request, res: Response){
        const order_id = Number(req.params.order_id);
        const order = await this.orderService.getOrderById(order_id);
        if(order){
          res.status(201).send({
            message: `Order ${order_id} was successfully retrieved`,
            data: order,
            status: res.statusCode,
          });
        } else {
          res.status(404).send({
            message: `Order ${order_id} cannot be retrieved`,
            status: res.statusCode,
            details: res.statusMessage,
          });
        }
    }

    async getUserOrders(req: Request, res: Response): Promise<void> {
        const user_id = parseInt(req.params.user_id);
        const data = await this.orderService.getUserOrders(user_id);
        if (data &&!data.error) {
            res.status(200).send({
                message: "Orders retrieved successfully",
                status: res.statusCode, order_data: data,
            });
        } else {
            res.status(400).send({
                message: "Failed to retrieve order", status: res.statusCode,
            });
        }
    }

    async getStoreOrders(req: Request, res: Response): Promise<void> {
        const store_id = parseInt(req.params.store_id);
        const data = await this.orderService.getStoreOrders(store_id);
        if (data &&!data.error) {
            res.status(200).send({
                message: "Orders retrieved successfully",
                status: res.statusCode, order_data: data,
            });
        } else {
            res.status(400).send({
                message: "Failed to retrieve order", status: res.statusCode,
            });
        }
    }

    async changeOrderAddress(req: Request, res: Response): Promise<void> {
        const { order_id, address_id } = req.body;
        const data = await this.orderService.changeOrderAddress(order_id, address_id);
        const shippingPrice = await this.cartService.calculateShippingPrice(order_id);
        if (data && !data.error && shippingPrice) {
            res.status(200).send({
                message: "Successfully updated destination address",
                status: res.statusCode,
            });
        } else {
            res.status(400).send({
                message: "Failed to update destination address", status: res.statusCode,
            });
        }
    }

    async changeOrderMethod(req: Request, res: Response): Promise<void> {
        const { order_id, shipping_method } = req.body;
        const data = await this.orderService.changeOrderMethod(order_id, shipping_method);
        const shippingPrice = await this.cartService.calculateShippingPrice(order_id);
        if (data && !data.error && shippingPrice) {
            res.status(200).send({
                message: "Successfully updated destination address",
                status: res.statusCode,
            });
        } else {
            res.status(400).send({
                message: "Failed to update destination address", status: res.statusCode,
            });
        }
    }
}
