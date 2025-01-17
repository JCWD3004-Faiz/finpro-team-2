import { PrismaClient } from "@prisma/client";
import { DiscountTypeEnum, VoucherType } from "../models/all.models";
import { voucherSchema } from "../validators/voucher.validator";
import { addMonths } from "date-fns";
import { calculateVoucher } from "../utils/discount.utils";

export class VoucherService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async generateRedeemCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let redeemCode = "";
    let isUnique = false;
    while (!isUnique) {
      redeemCode = "";
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        redeemCode += characters[randomIndex];
      }
      const existingCode = await this.prisma.userVouchers.findUnique({
        where: { redeem_code: redeemCode },
      });
      if (!existingCode) {
        isUnique = true;
      }
    }
    return redeemCode;
  }

  async calculateExpirationDate(voucher_id: number) {
    const voucher = await this.prisma.vouchers.findUnique({
      where: { voucher_id: voucher_id },
    });
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    const expirationDate = addMonths(new Date(), voucher.expire_period);
    return expirationDate;
  }

  async createVoucher(
    description: string,
    voucher_type: VoucherType,
    discount_type: DiscountTypeEnum,
    discount_amount: number,
    expire_period: number,
    min_purchase?: number,
    max_discount?: number
  ) {
    const dataToValidate = { discount_amount, expire_period };
    const validatedVoucher = voucherSchema.parse(dataToValidate);
    const newVoucher = await this.prisma.vouchers.create({
      data: {
        voucher_type,
        discount_type,
        discount_amount: validatedVoucher.discount_amount,
        expire_period: validatedVoucher.expire_period,
        min_purchase,
        max_discount,
        description,
      },
    });
    return newVoucher;
  }

  async getAllVouchers({
    sortField = "discount_amount",
    sortOrder = "asc",
    search = "",
    voucherType,
    discountType,
    page = 1,
    pageSize = 10,
  }: {
    sortField?: string;
    sortOrder?: "asc" | "desc";
    search?: string;
    voucherType?: string;
    discountType?: string;
    page?: number;
    pageSize?: number;
  }) {
    const orderBy: { [key: string]: "asc" | "desc" } = {};
    if (
      sortField === "discount_amount" ||
      sortField === "expire_period" ||
      sortField === "created_at"
    ) {
      orderBy[sortField] = sortOrder;
    } else {
      orderBy["discount_amount"] = "asc";
    }
    const where: any = {
      is_deleted: false,
      ...(search && { description: { contains: search, mode: "insensitive" } }),
      ...(voucherType && { voucher_type: voucherType }),
      ...(discountType && { discount_type: discountType }),
    };
    const skip = (page - 1) * pageSize;
    const vouchers = await this.prisma.vouchers.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    });
    const totalCount = await this.prisma.vouchers.count({ where });
    return { vouchers, totalCount };
  }

  async editVoucher(
    voucher_id: number,
    voucher_type: VoucherType,
    discount_type: DiscountTypeEnum,
    discount_amount: number,
    expire_period: number,
    min_purchase?: number,
    max_discount?: number,
    description?: string
  ) {
    const dataToValidate = { discount_amount, expire_period };
    const validatedVoucher = voucherSchema.parse(dataToValidate);
    const updatedVoucher = await this.prisma.vouchers.update({
      where: { voucher_id: voucher_id },
      data: {
        voucher_type,
        discount_type,
        discount_amount: validatedVoucher.discount_amount,
        expire_period: validatedVoucher.expire_period,
        min_purchase,
        max_discount,
        description,
      },
    });
    return updatedVoucher;
  }

  async deleteVoucher(voucher_id: number) {
    const deletedVoucher = await this.prisma.vouchers.update({
      where: { voucher_id },
      data: { is_deleted: true },
    });
    return deletedVoucher;
  }

  async giftVoucher(voucher_id: number, email: string) {
    const voucher = await this.prisma.vouchers.findUnique({
      where: { voucher_id: voucher_id, is_deleted: false },
    });
    if (!voucher) {
      throw new Error("Voucher not found or is deleted");
    }
    const user = await this.prisma.users.findUnique({
      where: { email: email },
    });
    if (!user) {
      throw new Error("User not found");
    }
    const redeemCode = await this.generateRedeemCode();
    const expiration_date = await this.calculateExpirationDate(voucher_id);
    const userVoucher = await this.prisma.userVouchers.create({
      data: {
        user_id: user.user_id,
        voucher_id: voucher_id,
        redeem_code: redeemCode,
        expiration_date: expiration_date,
      },
    });
    return userVoucher;
  }

  async sendReferralVoucher(user_id: number) {
    const referralVoucher = await this.prisma.vouchers.findUnique({
      where: { voucher_id: 9, is_deleted: false },
    });
    if (!referralVoucher) {
      throw new Error("Referral voucher not found or is deleted");
    }
    const redeemCode = await this.generateRedeemCode();
    const expiration_date = await this.calculateExpirationDate(
      referralVoucher.voucher_id
    );
    const userVoucher = await this.prisma.userVouchers.create({
      data: {
        user_id: user_id,
        voucher_id: referralVoucher.voucher_id,
        redeem_code: redeemCode,
        expiration_date: expiration_date,
      },
    });
    return userVoucher;
  }

  async sendCartVoucher(user_id: number, cart_price: number) {
    try {
      const confirmedOrders = await this.prisma.orders.count({
        where: { user_id, order_status: "ORDER_CONFIRMED" },
      });
      if (confirmedOrders % 3 !== 0) {
        return { error: "User is not eligible for a voucher yet." };
      }
      const vouchers = await this.prisma.vouchers.findMany({
        where: { min_purchase: { lte: cart_price }, is_deleted: false },
        orderBy: { min_purchase: "desc" },
      });
      if (vouchers.length === 0) {
        return { error: "No valid voucher found for this user" };
      }
      const closestVoucher = vouchers[0];
      const redeemCode = await this.generateRedeemCode();
      const expiration_date = await this.calculateExpirationDate(
        closestVoucher.voucher_id
      );
      const userVoucher = await this.prisma.userVouchers.create({
        data: {
          user_id,
          voucher_id: closestVoucher.voucher_id,
          redeem_code: redeemCode,
          expiration_date: expiration_date,
        },
      });
      return { message: "Cart voucher successfully sent", userVoucher };
    } catch (error) {
      console.error("Error sending cart voucher:", error);
      return { error: "Failed to apply voucher to cart" };
    }
  }

  async sendShippingVoucher(user_id: number) {
    try {
      const confirmedOrders = await this.prisma.orders.count({
        where: { user_id, order_status: "ORDER_CONFIRMED" },
      });
      if (confirmedOrders % 5 !== 0) {
        return { error: "User is not eligible for a shipping voucher yet." };
      }
      const shippingVoucher = await this.prisma.vouchers.findFirst({
        where: { voucher_type: "SHIPPING_DISCOUNT", is_deleted: false },
      });
      if (!shippingVoucher) {
        return { error: "No valid shipping voucher found." };
      }
      const redeemCode = await this.generateRedeemCode();
      const expiration_date = await this.calculateExpirationDate(
        shippingVoucher.voucher_id
      );
      const userVoucher = await this.prisma.userVouchers.create({
        data: {
          user_id,
          voucher_id: shippingVoucher.voucher_id,
          redeem_code: redeemCode,
          expiration_date,
        },
      });
      return { message: "Shipping voucher successfully sent.", userVoucher };
    } catch (error) {
      console.error("Error sending shipping voucher:", error);
      return { error: "Failed to apply shipping voucher." };
    }
  }

  async redeemProductVoucher(
    user_id: number,
    user_voucher_id: number,
    cart_item_id: number
  ) {
    try {
      const userVoucher = await this.prisma.userVouchers.findUnique({
        where: {
          user_voucher_id: user_voucher_id,
          user_id: user_id,
          voucher_status: "ACTIVE",
        },
        include: { Voucher: true },
      });
      if (!userVoucher) {
        throw new Error("Voucher not found");
      }
  
      const cartItem = await this.prisma.cartItems.findUnique({
        where: { cart_item_id: cart_item_id },
      });
      if (!cartItem) {
        throw new Error("Cart item not found");
      }

      const discountAmount = Number(userVoucher.Voucher.discount_amount)
      const productPrice = Number(cartItem.product_price)
      const minPurchase = Number(userVoucher.Voucher.min_purchase) || 0
      const maxDiscount = Number(userVoucher.Voucher.max_discount) || 0

      let newPrice;
      try {
        newPrice = calculateVoucher(
          discountAmount,
          userVoucher.Voucher.discount_type,
          productPrice,
          minPurchase,
          maxDiscount
        );
      } catch (voucherError:any) {
        return {error: voucherError.message}
      }
  
      await this.prisma.cartItems.update({
        where: { cart_item_id: cart_item_id },
        data: {
          product_price: newPrice,
          discount_type: userVoucher.Voucher.discount_type,
          discount_amount: userVoucher.Voucher.discount_amount,
        },
      });
  
      await this.prisma.userVouchers.update({
        where: { user_voucher_id: userVoucher.user_voucher_id },
        data: { voucher_status: "USED", used_at: new Date() },
      });
  
      return { ...cartItem, product_price: newPrice };
    } catch (error) {
      return { error: "Failed to apply product voucher discount" };
    }
  }

async redeemCartVoucher(
  user_id: number,
  user_voucher_id: number,
  cart_id: number
) {
  try {
    const userVoucher = await this.prisma.userVouchers.findUnique({
      where: {
        user_voucher_id: user_voucher_id,
        user_id: user_id,
        voucher_status: "ACTIVE",
      },
      include: { Voucher: true },
    });
    if (!userVoucher) {
      throw new Error("Voucher not found");
    }

    const cart = await this.prisma.carts.findUnique({
      where: { cart_id: cart_id, user_id: user_id, is_active: true },
    });
    if (!cart) {
      throw new Error("Cart not found");
    }

    const discountAmount = Number(userVoucher.Voucher.discount_amount)
    const cartPrice = Number(cart.cart_price)
    const minPurchase = Number(userVoucher.Voucher.min_purchase) || 0
    const maxDiscount = Number(userVoucher.Voucher.max_discount) || 0

    let newCartPrice;
    try {
      newCartPrice = calculateVoucher(
        discountAmount,
        userVoucher.Voucher.discount_type,
        cartPrice,
        minPurchase,
        maxDiscount
      );
    } catch (voucherError:any) {
      return {error: voucherError.message}
    }

    await this.prisma.carts.update({
      where: { cart_id: cart.cart_id },
      data: {
        cart_price: newCartPrice,
        discount_type: userVoucher.Voucher.discount_type,
        discount_amount: userVoucher.Voucher.discount_amount,
      },
    });

    await this.prisma.userVouchers.update({
      where: { user_voucher_id: userVoucher.user_voucher_id },
      data: { voucher_status: "USED", used_at: new Date() },
    });

    return {
      success: true,
      message: "Voucher applied successfully",
      newCartPrice: newCartPrice,
    };
  } catch (error) {
    console.error("Error redeeming cart voucher:", error);
    return { error: "Failed to apply cart voucher discount" };
  }
}

async redeemShippingVoucher(
    user_id: number,
    order_id: number,
    redeem_code: string
  ) {
    try {
      const userVoucher = await this.prisma.userVouchers.findUnique({
        where: {
          user_id: user_id,
          redeem_code: redeem_code,
          voucher_status: "ACTIVE",
        },
        include: { Voucher: true },
      });
      if (!userVoucher) {
        throw new Error("Voucher not found");
      }
  
      const order = await this.prisma.orders.findUnique({
        where: {
          order_id: order_id,
          user_id: user_id,
          order_status: "PENDING_PAYMENT",
        },
      });
      if (!order) {
        throw new Error("Order not found");
      }

      const discountAmount = Number(userVoucher.Voucher.discount_amount)
      const shippingPrice = Number(order.shipping_price)
      const minPurchase = Number(userVoucher.Voucher.min_purchase) || 0
      const maxDiscount = Number(userVoucher.Voucher.max_discount) || 0
  
      let newShippingPrice;
      try {
        newShippingPrice = calculateVoucher(
          discountAmount,
          userVoucher.Voucher.discount_type,
          shippingPrice,
          minPurchase,
          maxDiscount
        );
      } catch (voucherError:any) {
        return {error: voucherError.message}
      }
  
      await this.prisma.orders.update({
        where: { order_id: order_id },
        data: {
          shipping_price: newShippingPrice,
          discount_type: userVoucher.Voucher.discount_type,
          discount_amount: userVoucher.Voucher.discount_amount,
        },
      });
  
      await this.prisma.userVouchers.update({
        where: { user_voucher_id: userVoucher.user_voucher_id },
        data: { voucher_status: "USED", used_at: new Date() },
      });
  
      return {
        success: true,
        message: "Voucher applied successfully",
        newShippingPrice: newShippingPrice,
      };
    } catch (error) {
      console.error("Error redeeming shipping voucher:", error);
      return { error: "Failed to apply shipping voucher discount" };
    }
  }

  async getUserVouchers(user_id: number) {
    try {
      const userVouchers = await this.prisma.userVouchers.findMany({
        where: { user_id: user_id, voucher_status: "ACTIVE" },
        include: { Voucher: true },
      });
      const mappedVouchers = userVouchers.map((userVoucher) => ({
        user_voucher_id: userVoucher.user_voucher_id,
        redeem_code: userVoucher.redeem_code,
        expiration_date: userVoucher.expiration_date,
        discount_type: userVoucher.Voucher.discount_type,
        voucher_type: userVoucher.Voucher.voucher_type,
        discount_amount: userVoucher.Voucher.discount_amount,
        min_purchase: userVoucher.Voucher.min_purchase,
        max_discount: userVoucher.Voucher.max_discount,
        description: userVoucher.Voucher.description,
      }));
      return { vouchers: mappedVouchers };
    } catch (error) {
      console.error("Error fetching user vouchers:", error);
      return { error: "Failed to fetch user vouchers." };
    }
  }

  async getShippingVouchers(user_id: number) {
    try {
      const shippingVouchers = await this.prisma.userVouchers.findMany({
        where: {
          user_id: user_id,
          voucher_status: "ACTIVE",
          Voucher: { voucher_type: "SHIPPING_DISCOUNT" },
        },
        include: { Voucher: true },
      });
      const mappedVouchers = shippingVouchers.map((shippingVoucher) => ({
        redeem_code: shippingVoucher.redeem_code,
        discount_type: shippingVoucher.Voucher.discount_type,
        discount_amount: shippingVoucher.Voucher.discount_amount,
      }));
      return { vouchers: mappedVouchers };
    } catch (error) {
      console.error("Error fetching shipping vouchers:", error);
      return { error: "Failed to fetch shipping vouchers." };
    }
  }

  async getCartVouchers(user_id: number) {
    try {
      const cartVouchers = await this.prisma.userVouchers.findMany({
        where: {
          user_id: user_id,
          voucher_status: "ACTIVE",
          Voucher: {
            voucher_type: { in: ["PRODUCT_DISCOUNT", "CART_DISCOUNT"] },
          },
        },
        include: { Voucher: true },
      });
      const mappedVouchers = cartVouchers.map((cartVoucher) => ({
        user_voucher_id: cartVoucher.user_voucher_id,
        redeem_code: cartVoucher.redeem_code,
        voucher_type: cartVoucher.Voucher.voucher_type,
        discount_type: cartVoucher.Voucher.discount_type,
        discount_amount: cartVoucher.Voucher.discount_amount,
      }));
      return { vouchers: mappedVouchers };
    } catch (error) {
      console.error("Error fetching cart vouchers:", error);
      return { error: "Failed to fetch cart vouchers." };
    }
  }
}
