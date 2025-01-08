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