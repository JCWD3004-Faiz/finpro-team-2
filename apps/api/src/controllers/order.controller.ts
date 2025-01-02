import { Request, Response } from "express";
import { OrderService } from "../services/order.service";
import { CartService } from "../services/cart.service";
import { OrderStatus } from "../models/admin.models";

export class OrderController {
    private orderService: OrderService;
    private cartService: CartService;

    constructor() {
        this.orderService = new OrderService();
        this.cartService = new CartService();
    }

    async getAllOrders(req: Request, res: Response){
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const sortFieldAdmin = (req.query.sortFieldAdmin as string) || "created_at";
        const sortOrder = (req.query.sortOrder as string) || "asc";
        const search = (req.query.search as string) || "";
        let orderStatus: OrderStatus[] = [];
        if (req.query.orderStatus) { orderStatus = Array.isArray(req.query.orderStatus)
            ? (req.query.orderStatus as string[]).map(status => status as OrderStatus)
            : [req.query.orderStatus as string].map(status => status as OrderStatus);
        }
        const storeName = (req.query.storeName as string) || "";
        const order = await this.orderService.getAllOrders(
            page, pageSize, sortFieldAdmin as "created_at",
            sortOrder as "asc" | "desc", search, orderStatus, storeName
        );
        if (order &&!order.error) {
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
        const user_id = parseInt(req.params.user_id);
        const order_id = parseInt(req.params.order_id);
        const order = await this.orderService.getOrderById(user_id,order_id);
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
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        const sortFieldAdmin = (req.query.sortFieldAdmin as string) || "created_at";
        const sortOrder = (req.query.sortOrder as string) || "asc";
        const search = (req.query.search as string) || "";
        let orderStatus: OrderStatus[] = [];
        if (req.query.orderStatus) { orderStatus = Array.isArray(req.query.orderStatus)
            ? (req.query.orderStatus as string[]).map(status => status as OrderStatus)
            : [req.query.orderStatus as string].map(status => status as OrderStatus);
        }
        const data = await this.orderService.getStoreOrders(
            store_id, page, pageSize, sortFieldAdmin as "created_at",
            sortOrder as "asc" | "desc", search, orderStatus
        );
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
        const { user_id, order_id, address_id } = req.body;
        const data = await this.orderService.changeOrderAddress(user_id, order_id, address_id);
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
        const { user_id, order_id, shipping_method } = req.body;
        const data = await this.orderService.changeOrderMethod(user_id, order_id, shipping_method);
        const shippingPrice = await this.cartService.calculateShippingPrice(order_id);
        if (data && !data.error && shippingPrice) {
            res.status(200).send({
                message: "Successfully updated shipping method",
                status: res.statusCode,
            });
        } else {
            res.status(400).send({
                message: "Failed to update shipping method", status: res.statusCode,
            });
        }
    }

    async processOrder(req: Request, res: Response) {
        const store_id = parseInt(req.params.store_id);
        const order_id = parseInt(req.params.order_id);
        const data = await this.orderService.processOrder(store_id, order_id);
        if (data && !data.error) {
            const sentData = await this.orderService.sentOrder(order_id);
            if (sentData && !sentData.error) {
                res.status(201).send({
                    message: `Order ${order_id} was successfully processed and sent.`,
                    data: data, status: res.statusCode,
                });
            } else {
                res.status(400).send({
                    message: `Order ${order_id} was processed, but failed to update to SENT.`,
                    status: res.statusCode, details: sentData,
                });
            }
        } else {
            res.status(404).send({
                message: `Order ${order_id} cannot be processed`,
                status: res.statusCode, details: data,
            });
        }
    }

    async confirmUserOrder(req: Request, res: Response){
        const user_id = parseInt(req.params.user_id);
        const order_id = parseInt(req.params.order_id);
        const data = await this.orderService.confirmUserOrder(user_id, order_id);
        if(data &&!data.error){
          res.status(201).send({
            message: `Order ${order_id} was successfully confirmed`,
            data: data,
            status: res.statusCode,
          });
        } else {
          res.status(404).send({
            message: `Order ${order_id} cannot be confirmed`,
            status: res.statusCode,
            details: data,
          });
        }
    }

    async cancelUserOrder(req: Request, res: Response){
        const user_id = parseInt(req.params.user_id);
        const order_id = parseInt(req.params.order_id);
        const data = await this.orderService.cancelUserOrder(user_id, order_id);
        if(data &&!data.error){
          res.status(201).send({
            message: `Order ${order_id} was successfully cancelled`,
            data: data,
            status: res.statusCode,
          });
        } else {
          res.status(404).send({
            message: `Order ${order_id} cannot be cancelled`,
            status: res.statusCode,
            details: data,
          });
        }
    }
}
