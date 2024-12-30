export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface CartItem {
  cart_item_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  stock_available: number;
}

export interface PaymentProof {
  pop_image: string;
  created_at: string;
}

export interface Payment {
  id: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  status: PaymentStatus;
  date: string;
  cartItems: CartItem[];
  paymentProof?: PaymentProof;
}