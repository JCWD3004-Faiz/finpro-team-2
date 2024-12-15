export interface StoreAdmin {
    user_id: number;
    username: string;
    email: string;
    store_name: string;
}

export interface Register {
    username: string;
    email: string;
    password_hash: string;
}


export interface User {
    user_id: number;
    username: string;
    email: string;
    password_hash?: string;
    role?: Role;
    referral_code?: string;
    register_code?: string;
    refresh_token?: string;
    is_verified?: boolean;
    image?: string;
    created_at?: Date;
    updated_at?: Date;
}

export enum Role {
    USER = 'USER',
    STORE_ADMIN = 'STORE_ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN',
}
  
export interface Store {
    store_id: number;
    user_id?: number;
    store_name: string;
    latitude: number;
    longitude: number;
    store_location: string;
    city_id: number
    store_admin?: string;
    created_at: Date;
    updated_at: Date;
}
  
export interface Category {
    category_id: number;
    category_name: string;
    created_at: Date;
}
  
export interface Product {
    product_id: number;
    category_id: number;
    product_name: string;
    description: string;
    quantity: number;
    price: number;
    availability: boolean;
    image?: string;
    created_at: Date;
    updated_at: Date;
}
  
export interface Inventory {
    inventory_id: number;
    store_id: number;
    product_id: number;
    stock: number;
    discounted_price?: number;
    updated_at: Date;
}
  
export interface StockJournal {
    journal_id: number;
    inventory_id: number;
    change_type: ChangeType;
    change_quantity: number;
    prev_stock: number;
    new_stock: number;
    change_category?: ChangeCategory;
    created_at: Date;
}

export enum ChangeType {
    INCREASE = 'INCREASE',
    DECREASE = 'DECREASE',
}
  
export enum ChangeCategory {
    SOLD = 'SOLD',
    STOCK_CHANGE = 'STOCK_CHANGE',
    OTHERS = 'OTHERS',
}
  
export interface ProductImage {
    image_id: number;
    product_id: number;
    product_image: string;
    is_primary: boolean;
}
  
export interface Discount {
    discount_id: number;
    inventory_id?: number;
    store_id: number;
    type: DiscountType;
    value?: number;
    min_purchase?: number;
    max_discount?: number;
    bogo_product_id?: number;
    is_active: boolean;
    image?: string;
    start_date: Date;
    end_date: Date;
    created_at: Date;
    updated_at: Date;
}

export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    NOMINAL = 'NOMINAL',
    BOGO = 'BOGO',
}
  
export interface Order {
    order_id: number;
    cart_id: number;
    store_id: number;
    address_id: number;
    cart_price: number;
    order_status: OrderStatus;
    shipping_method: string;
    shipping_price: number;
    created_at: Date;
    updated_at: Date;
}

export enum OrderStatus {
    PENDING_PAYMENT = 'PENDING_PAYMENT',
    AWAITING_CONFIRMATION = 'AWAITING_CONFIRMATION',
    PROCESSING = 'PROCESSING',
    SENT = 'SENT',
    ORDER_CONFIRMED = 'ORDER_CONFIRMED',
    CANCELLED = 'CANCELLED',
}
  
export interface Sale {
    sales_id: number;
    store_id: number;
    product_id: number;
    category_id: number;
    month: number;
    year: number;
    total_sales: number;
}