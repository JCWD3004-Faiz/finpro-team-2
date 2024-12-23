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
            const { type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description } = req.body;
            await this.voucherService.createVoucher(type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description);
            res.status(201).send({
                message: "Voucher successfully created",
                status: res.statusCode,
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to create Voucher`);
        }
    }

    async getAllVouchers(req: Request, res: Response){
        try {
            const vouchers = await this.voucherService.getAllVouchers();
            res.status(200).send({
                data: vouchers,
                status: res.statusCode,
            });
        } catch (error) {
            sendErrorResponse(res, 500, `Failed to get all vouchers`);
        }
    }

    async editVoucher(req: Request, res: Response){
        try {
            const voucher_id = parseInt(req.params.voucher_id)
            const { type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description } = req.body;
            await this.voucherService.editVoucher(voucher_id, type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description);
            res.status(200).send({
                message: "Voucher successfully edited",
                status: res.statusCode,
            });
        } catch (error) {
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
            const user_id = parseInt(req.params.user_id)
            await this.voucherService.giftVoucher(voucher_id, user_id);
            res.status(200).send({
                message: "Voucher successfully gifted",
                status: res.statusCode,
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to gift Voucher`);
        }
    }

    async selectVoucher(req: Request, res: Response){
        try {
            const user_id = parseInt(req.params.user_id)
            const redeem_code = req.body.redeem_code
            const data = await this.voucherService.selectVoucher(user_id, redeem_code);
            res.status(200).send({
                message: "Voucher successfully selected",
                status: res.statusCode, data: data
            });
        } catch (error) {
            sendErrorResponse(res, 400, `Failed to select Voucher`);
        }
    }

    async redeemProductVoucher(req: Request, res: Response){
        const { user_id, user_voucher_id, cart_item_id } = req.body;
        const data = await this.voucherService.redeemProductVoucher(user_id, user_voucher_id, cart_item_id);
        if (data && !data.error) {
            const cartPrice = await this.cartService.updateCartPrice(user_id);
            if (cartPrice && !cartPrice.error) {
                res.status(200).send({
                message: "Successfully applied product voucher discount",
                status: res.statusCode, data: data,
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
            const { user_id, user_voucher_id, cart_item_id } = req.body;
            const data = await this.voucherService.redeemCartVoucher(user_id, user_voucher_id, cart_item_id);
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
}