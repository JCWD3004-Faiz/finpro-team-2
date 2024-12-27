export interface CreateDiscount {
  inventory_id?: number;
  store_id: number;
  type: "PERCENTAGE" | "NOMINAL" | "BOGO";
  value?: number;
  min_purchase?: number;
  max_discount?: number;
  bogo_product_id?: number;
  description: string;
  is_active?: boolean;
  image?: string;
  start_date: string;
  end_date: string;
}

export interface Discount {
  discount_id: number;
  inventory_id: number | null;
  store_id: number;
  type: "PERCENTAGE" | "NOMINAL" | "BOGO"; // Enum-like type for discount type
  value: number | null;
  min_purchase: number | null;
  max_discount: number | null;
  bogo_product_id: number | null;
  description: string | null;
  is_active: boolean;
  image: string | null;
  start_date: string; // ISO 8601 format for date
  end_date: string; // ISO 8601 format for date
  is_deleted: boolean;
  created_at: string; // ISO 8601 format for date
  updated_at: string; // ISO 8601 format for date
}
