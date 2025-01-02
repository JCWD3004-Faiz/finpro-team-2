export interface CreateProduct {
  category_id: number;
  product_name: string;
  description: string;
  price: number;
  product_image: string[];
}

export interface UpdateProduct {
  product_name?: string;
  description?: string;
  price?: number;
}

export interface GetProductInventoryUser {
  store_id: number; 
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortField?: "price" | "product_name";
  sortOrder?: "asc" | "desc";
}
