import { PrismaClient } from "@prisma/client";
import { DiscountTypeEnum, VoucherType } from "../models/all.models";
import { voucherSchema } from "../validators/voucher.validator";
import { addMonths } from "date-fns";

export class VoucherService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    private async generateRedeemCode(){
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let redeemCode = ''; let isUnique = false;
        while (!isUnique) {
            redeemCode = '';
            for (let i = 0; i < 4; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                redeemCode += characters[randomIndex];
            }
            const existingCode = await this.prisma.userVouchers.findUnique({ where: { redeem_code: redeemCode }});
            if (!existingCode) {isUnique = true}
        } return redeemCode;
    }

    async calculateExpirationDate(voucher_id: number) {
        const voucher = await this.prisma.vouchers.findUnique({ where: { voucher_id: voucher_id }});
        if (!voucher) { throw new Error("Voucher not found")}
        const expirationDate = addMonths(new Date(), voucher.expire_period); return expirationDate;
    }

    async createVoucher(
        description: string, voucher_type: VoucherType, discount_type: DiscountTypeEnum,
        discount_amount: number, expire_period: number, min_purchase?: number, max_discount?: number,
    ) {
        const dataToValidate = { discount_amount, expire_period }; const validatedVoucher = voucherSchema.parse(dataToValidate);
        const newVoucher = await this.prisma.vouchers.create({
            data: {
                voucher_type, discount_type, discount_amount: validatedVoucher.discount_amount, 
                expire_period: validatedVoucher.expire_period, min_purchase, max_discount, description,
            },
        }); 
        return newVoucher;
    }
    
    async getAllVouchers({
        sortField = 'discount_amount', sortOrder = 'asc', search = '', voucherType, discountType, page = 1, pageSize = 10 }: {
        sortField?: string; sortOrder?: 'asc' | 'desc'; search?: string; voucherType?: string; discountType?: string; page?: number; pageSize?: number;
      }) {
        const orderBy: { [key: string]: 'asc' | 'desc' } = {};
        if (sortField === 'discount_amount' || sortField === 'expire_period' || sortField === 'created_at') {
          orderBy[sortField] = sortOrder } else { orderBy['discount_amount'] = 'asc';
        }
        const where: any = { is_deleted: false, ...(search && { description: { contains: search, mode: 'insensitive'},
          }), ...(voucherType && { voucher_type: voucherType }), ...(discountType && { discount_type: discountType }),
        };
        const skip = (page - 1) * pageSize;
        const vouchers = await this.prisma.vouchers.findMany({ where, orderBy, skip, take: pageSize });
        const totalCount = await this.prisma.vouchers.count({ where });
        return { vouchers, totalCount};
    }

    async editVoucher(
        voucher_id:number, voucher_type: VoucherType, discount_type: DiscountTypeEnum, discount_amount: number,
        expire_period: number, min_purchase?: number, max_discount?: number, description?: string
    ){
        console.log('Service method called with:', {
            voucher_id, voucher_type, discount_type, discount_amount, expire_period, min_purchase, max_discount, description
        });
        const dataToValidate = { discount_amount, expire_period }; const validatedVoucher = voucherSchema.parse(dataToValidate);
        console.log('Data to validate:', dataToValidate);
        console.log('Validated voucher:', validatedVoucher);


        const updatedVoucher = await this.prisma.vouchers.update({
            where: { voucher_id: voucher_id },
            data: {
                voucher_type, discount_type, discount_amount: validatedVoucher.discount_amount, 
                expire_period: validatedVoucher.expire_period, min_purchase, max_discount, description,
            },
            
        }); 
        console.log('Updated voucher:', updatedVoucher);

        return updatedVoucher;
    }

    async deleteVoucher(voucher_id:number){
        const deletedVoucher = await this.prisma.vouchers.update({
          where: { voucher_id }, data: { is_deleted: true },
        }); return deletedVoucher;
    }

    async giftVoucher(voucher_id: number, email: string) {
        const voucher = await this.prisma.vouchers.findUnique({ where: { voucher_id: voucher_id, is_deleted: false }});
        if (!voucher) { throw new Error("Voucher not found or is deleted")}    
        const user = await this.prisma.users.findUnique({ where: { email: email }});
        if (!user) { throw new Error("User not found")}    
        const redeemCode = await this.generateRedeemCode();
        const expiration_date = await this.calculateExpirationDate(voucher_id);    
        const userVoucher = await this.prisma.userVouchers.create({
            data: { user_id: user.user_id, voucher_id: voucher_id, redeem_code: redeemCode, expiration_date: expiration_date}
        });
        return userVoucher;
    }

    async sendReferralVoucher(user_id: number) {
        const referralVoucher = await this.prisma.vouchers.findUnique({where: { voucher_id: 9, is_deleted: false }});
        if (!referralVoucher) { throw new Error("Referral voucher not found or is deleted")}
        const redeemCode = await this.generateRedeemCode();   
        const expiration_date = await this.calculateExpirationDate(referralVoucher.voucher_id);    
        const userVoucher = await this.prisma.userVouchers.create({
            data: { user_id: user_id, voucher_id: referralVoucher.voucher_id, redeem_code: redeemCode, expiration_date: expiration_date}});    
        return userVoucher;
    }

    async sendCartVoucher(user_id: number, cart_price: number) {
        try {
            const vouchers = await this.prisma.vouchers.findMany({
                where: { min_purchase: { lte: cart_price }, is_deleted: false}, orderBy: { min_purchase: 'desc'}
            });
            if (vouchers.length === 0) { return { error: "No valid voucher found for this cart" }}
            const closestVoucher = vouchers[0]; const redeemCode = await this.generateRedeemCode();   
            const expiration_date = await this.calculateExpirationDate(closestVoucher.voucher_id);
            const userVoucher = await this.prisma.userVouchers.create({
                data: { user_id, voucher_id: closestVoucher.voucher_id,redeem_code:redeemCode, expiration_date: expiration_date},
            });
            return {message: "Voucher successfully applied to cart", userVoucher};
        } catch (error) {
            console.error("Error sending cart voucher:", error);
            return { error: "Failed to apply voucher to cart" };
        }
    }

    async sendShippingVoucher(user_id: number) {
        try {
            const confirmedOrders = await this.prisma.orders.count({ where: { user_id, order_status: "AWAITING_CONFIRMATION"}});
            if (confirmedOrders % 3 !== 0) { return { error: "User is not eligible for a shipping voucher yet." }}
            const shippingVoucher = await this.prisma.vouchers.findFirst({ where: { voucher_type: "SHIPPING_DISCOUNT", is_deleted: false}});
            if (!shippingVoucher) { return { error: "No valid shipping voucher found." }} 
            const redeemCode = await this.generateRedeemCode();   
            const expiration_date = await this.calculateExpirationDate(shippingVoucher.voucher_id);    
            const userVoucher = await this.prisma.userVouchers.create({
                data: { user_id, voucher_id: shippingVoucher.voucher_id, redeem_code: redeemCode,expiration_date},
            });
            return { message: "Shipping voucher successfully applied.", userVoucher};
        } catch (error) {
            console.error("Error sending shipping voucher:", error);
            return { error: "Failed to apply shipping voucher." };
        }
    }

    async selectVoucher(user_id: number, redeem_code: string) {
        try {
          const userVoucher = await this.prisma.userVouchers.findFirst({
            where: { user_id: user_id, redeem_code: redeem_code, voucher_status: "ACTIVE" }, include: { Voucher: true },
        });
          if (!userVoucher) { return { error: "Voucher not found, expired, or already used." }}      
          if (userVoucher.Voucher.voucher_type === "SHIPPING_DISCOUNT") { return { error: "This voucher is not valid for redemption." }}      
          return { user_voucher_id: userVoucher.user_voucher_id, discount_type: userVoucher.Voucher.discount_type };
        } catch (error) {
          console.error(error);
          return { error: "An error occurred while selecting the voucher." };
        }
    }

    async redeemProductVoucher(user_id: number, user_voucher_id: number, cart_item_id: number) {
        try {
            const userVoucher = await this.prisma.userVouchers.findUnique({
                where: { user_voucher_id: user_voucher_id, user_id: user_id, voucher_status: "ACTIVE" }, include: { Voucher: true },
            });
            if (!userVoucher) { throw new Error('Voucher not found') }
            const cartItem = await this.prisma.cartItems.findUnique({ where: { cart_item_id: cart_item_id } });
            if (!cartItem) { throw new Error('Cart item not found') }
            const discountAmount = Number(userVoucher.Voucher.discount_amount);
            const minPurchase = userVoucher.Voucher.min_purchase || 0;
            const maxDiscount = Number(userVoucher.Voucher.max_discount || 0);    
            if (cartItem.product_price < minPurchase) { throw new Error('Product does not meet the minimum purchase requirement')}
            let newPrice = Number(cartItem.product_price);
            let calculatedDiscount = (newPrice * discountAmount) / 100;            
            if (maxDiscount > 0 && calculatedDiscount > maxDiscount) { throw new Error(`Discount exceeds the maximum allowed discount of ${maxDiscount}`)}
            newPrice = Math.max(newPrice - calculatedDiscount, 0);
            await this.prisma.cartItems.update({
                where: { cart_item_id: cart_item_id },
                data: { product_price: newPrice, discount_type: userVoucher.Voucher.discount_type, discount_amount: discountAmount },
            });
            await this.prisma.userVouchers.update({
                where: { user_voucher_id: userVoucher.user_voucher_id }, data: { voucher_status: "USED", used_at: new Date() },
            });
            return { success: true, message: 'Voucher applied successfully', newPrice: newPrice };
        } catch (error) {
            return { error: "Failed to apply product voucher discount" };
        }
    }

    async redeemCartVoucher(user_id: number, user_voucher_id: number, cart_id: number) {
        try {
            const userVoucher = await this.prisma.userVouchers.findUnique({
                where: { user_voucher_id: user_voucher_id, user_id: user_id, voucher_status: "ACTIVE" }, include: { Voucher: true },
            });
            if (!userVoucher) { throw new Error('Voucher not found') }
            const cart = await this.prisma.carts.findUnique({ where: { cart_id: cart_id, user_id: user_id, is_active: true }});
            if (!cart) { throw new Error('Cart not found') }
            const discountAmount = Number(userVoucher.Voucher.discount_amount);
            const minPurchase = userVoucher.Voucher.min_purchase || 0;
            const maxDiscount = Number(userVoucher.Voucher.max_discount || 0);    
            if (cart.cart_price < minPurchase) { throw new Error('Cart does not meet the minimum purchase requirement')}
            let newCartPrice = Number(cart.cart_price);
            let calculatedDiscount = (newCartPrice * discountAmount) / 100;    
            if (maxDiscount > 0 && calculatedDiscount > maxDiscount) {
                throw new Error(`Discount exceeds the maximum allowed discount of ${maxDiscount}`);
            }
            newCartPrice = Math.max(newCartPrice - calculatedDiscount, 0);
            await this.prisma.carts.update({
                where: { cart_id: cart.cart_id },
                data: { cart_price: newCartPrice, discount_type: userVoucher.Voucher.discount_type, discount_amount: discountAmount },
            });
            await this.prisma.userVouchers.update({
                where: { user_voucher_id: userVoucher.user_voucher_id }, data: { voucher_status: "USED", used_at: new Date() },
            });
            return { success: true, message: 'Voucher applied successfully', newCartPrice: newCartPrice };
        } catch (error) {
            console.error("Error redeeming cart voucher:", error);
            return { error: "Failed to apply cart voucher discount" };
        }
    }

    async redeemShippingVoucher(user_id: number, order_id: number, redeem_code: string) {
        try {
            const userVoucher = await this.prisma.userVouchers.findUnique({
                where: { user_id: user_id, redeem_code: redeem_code, voucher_status: "ACTIVE" }, include: { Voucher: true },
            });
            if (!userVoucher) { throw new Error('Voucher not found') }
            const order = await this.prisma.orders.findUnique({
                where: { order_id: order_id, user_id: user_id, order_status: "PENDING_PAYMENT" },
            });
            if (!order) { throw new Error('Order not found') }
            const discountAmount = Number(userVoucher.Voucher.discount_amount);
            const minPurchase = userVoucher.Voucher.min_purchase || 0;
            const maxDiscount = Number(userVoucher.Voucher.max_discount || 0);
            if (order.shipping_price < minPurchase) { throw new Error('Shipping does not meet the minimum price requirement')}
            let newShippingPrice = Number(order.shipping_price);
            let calculatedDiscount = (newShippingPrice * discountAmount) / 100;    
            if (maxDiscount > 0 && calculatedDiscount > maxDiscount) { throw new Error(`Discount exceeds the maximum allowed discount of ${maxDiscount}`)}
            newShippingPrice = Math.max(newShippingPrice - calculatedDiscount, 0);
            await this.prisma.orders.update({
                where: { order_id: order_id },
                data: { shipping_price: newShippingPrice, discount_type: userVoucher.Voucher.discount_type, discount_amount: discountAmount },
            });
            await this.prisma.userVouchers.update({
                where: { user_voucher_id: userVoucher.user_voucher_id }, data: { voucher_status: "USED", used_at: new Date() },
            });
            return { success: true, message: 'Voucher applied successfully', newShippingPrice: newShippingPrice };
        } catch (error) {
            console.error("Error redeeming shipping voucher:", error);
            return { error: "Failed to apply shipping voucher discount" };
        }
    }
}