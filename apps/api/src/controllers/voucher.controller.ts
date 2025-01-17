import { Request, Response } from "express";
import { VoucherService } from "../services/voucher.service";
import { CartService } from "../services/cart.service";
import { sendErrorResponse } from "../utils/response.utils";

export class VoucherController {
    private voucherService: VoucherService;
    private cartService: CartService;


    constructor() {
        this.voucherService = new VoucherService();
        this.cartService = new CartService();

    }

    async createVoucher(req: Request, res: Response){
        try {
            const {description, voucher_type, discount_type, discount_amount, expire_period, min_purchase, max_discount } = req.body;
            await this.voucherService.createVoucher( description, voucher_type, discount_type, discount_amount, expire_period, min_purchase, max_discount);
            res.status(201).send({
                message: "Voucher successfully created",
                status: res.statusCode,
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to create Voucher`);
        }
    }

    async getAllVouchers(req: Request, res: Response) {
        try {
          const { sortField = 'discount_amount', sortOrder = 'asc', search = '', voucherType = '', discountType = '', page = 1, pageSize = 10 } = req.query;
          const { vouchers, totalCount } = await this.voucherService.getAllVouchers({
            sortField: sortField as string, sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
            search: search as string, voucherType: voucherType as string, discountType: discountType as string,
            page: Number(page), pageSize: Number(pageSize),
          });
          const totalPages = Math.ceil(totalCount / Number(pageSize));
          res.status(200).send({
            status: res.statusCode, data: vouchers,
            pagination: { page: Number(page), pageSize: Number(pageSize), totalCount, totalPages },
          });
        } catch (error) {
          sendErrorResponse(res, 400, `Failed to get all vouchers`);
        }
    }

    async editVoucher(req: Request, res: Response){
        try {
            const voucher_id = parseInt(req.params.voucher_id)
            const { voucher_type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description } = req.body;
            await this.voucherService.editVoucher(voucher_id, voucher_type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description);
            res.status(200).send({
                message: "Voucher successfully edited",
                status: res.statusCode,
            });
        } catch (error) {
            console.error('Error in editVoucher controller:', error);  // Log the error in the controller
            sendErrorResponse(res, 400, `Failed to edit Voucher`);
        }
    }

    async deleteVoucher(req: Request, res: Response){
        try {
            const voucher_id = parseInt(req.params.voucher_id)
            await this.voucherService.deleteVoucher(voucher_id);
            res.status(200).send({
                message: "Voucher successfully deleted",
                status: res.statusCode,
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to delete Voucher`);
        }
    }

    async giftVoucher(req: Request, res: Response){
        try {
            const voucher_id = parseInt(req.params.voucher_id)
            const email = req.body.email
            await this.voucherService.giftVoucher(voucher_id, email);
            res.status(200).send({
                message: "Voucher successfully gifted",
                status: res.statusCode,
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to gift Voucher`);
        }
    }

    async redeemProductVoucher(req: Request, res: Response){
        const { user_id, user_voucher_id, cart_item_id } = req.body;
        const cartItem = await this.voucherService.redeemProductVoucher(user_id, user_voucher_id, cart_item_id);
        if (cartItem) {
            const cartPrice = await this.cartService.updateCartPrice(user_id);
            if (cartPrice) {
                res.status(200).send({
                message: "Successfully applied product voucher discount",
                status: res.statusCode, data: {cartItem, cartPrice}
            });
            } else {
                res.status(400).send({
                    message: "Failed to update cart price", status: res.statusCode,
                });
            }
        } else {
            res.status(400).send({
                message: "Failed to apply product voucher discount", status: res.statusCode,
            });
        }
    }

    async redeemCartVoucher(req: Request, res: Response){
        try {
            const { user_id, user_voucher_id, cart_id } = req.body;
            const data = await this.voucherService.redeemCartVoucher(user_id, user_voucher_id, cart_id);
            res.status(200).send({
                message: "Successfully applied cart voucher discount",
                status: res.statusCode, data: data
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to apply cart voucher discount`);
        }
    }

    async redeemShippingVoucher(req: Request, res: Response){
        try {
            const { user_id, order_id, redeem_code } = req.body;
            const data = await this.voucherService.redeemShippingVoucher(user_id, order_id, redeem_code);
            res.status(200).send({
                message: "Successfully applied shipping voucher discount",
                status: res.statusCode, data: data
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to apply shipping voucher discount`);
        }
    }

    async getUserVouchers(req: Request, res: Response){
        try {
            const user_id = parseInt(req.params.user_id)
            const data = await this.voucherService.getUserVouchers(user_id);
            res.status(200).send({
                message: "Successfully retrieved user vouchers",
                status: res.statusCode, data: data
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to retrieve user vouchers`);
        }
    }

    async getShippingVouchers(req: Request, res: Response){
        try {
            const user_id = parseInt(req.params.user_id)
            const data = await this.voucherService.getShippingVouchers(user_id);
            res.status(200).send({
                message: "Successfully retrieved shipping vouchers",
                status: res.statusCode, data: data
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to retrieve shipping vouchers`);
        }
    }

    async getCartVouchers(req: Request, res: Response){
        try {
            const user_id = parseInt(req.params.user_id)
            const data = await this.voucherService.getCartVouchers(user_id);
            res.status(200).send({
                message: "Successfully retrieved cart vouchers",
                status: res.statusCode, data: data
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to retrieve cart vouchers`);
        }
    }
}