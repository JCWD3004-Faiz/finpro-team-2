import { DiscountTypeEnum, VoucherType } from "./adminInterface";

export interface ItemDetails {
    cart_item_id: string;
    product_name: string;
    quantity: number;
    product_price: number;
    original_price: number;
}

export interface Address {
    address_id: number;
    address: string;
    city_name: string;
    city_id:number
    is_default: boolean;
}
  
export interface NewAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface UserVoucher {
    user_voucher_id: number;
    redeem_code: string;
    expiration_date: Date;
    discount_type: DiscountTypeEnum;
    voucher_type: VoucherType;
    discount_amount: number;
    min_purchase: number;
    max_discount: number;    
    description: string;
}