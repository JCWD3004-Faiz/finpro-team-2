import { StoreAdmin, Store, Order } from "@/utils/adminInterface";
import { ItemDetails, UserVoucher } from "./userInterface";

export interface SuperAdminState {
  storeAdmins: StoreAdmin[];
  loading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  editId: number | null;
  editStoreData: {
    storeName: string;
    locationName: string;
    cityId: number;
  };
  editAdminData: { storeName: string; storeId: number };
  locationSuggestions: { city_name: string; city_id: number }[];
  storeSuggestions: {
    store_name: string;
    store_id: number;
    store_admin: string;
  }[];
  suggestionsPosition: { top: number; left: number; width: number };
  allStores: Store[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  sortField: string;
  sortFieldAdmin: string;
  sortFieldOrder: string;
  orderStatus: string;
  allOrders: Order[];
  storeName: string;
  storeNames: string[];
}

export interface FetchAllParams {
  page: number;
  sortField?: string;
  sortFieldAdmin?: string;
  sortOrder: string;
  search?: string;
}

export interface StoreAdminState {
  storeName: string;
  storeLocation: string;
  adminName: string;
  loading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
  storeOrders: Order[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  sortField: string;
  orderStatus: string;
}

export const fieldEndpointMap: { [key: string]: string } = {
  product_name: "name",
  description: "description",
  price: "price",
};

export interface InventoryName {
  inventory_id: number;
  product_id: number;
  product_name: string;
}

export interface Discount {
  discount_id: number;
  inventory_id: number | null;
  store_id: number;
  product_name: string;
  type: "BOGO" | "PERCENTAGE" | "NOMINAL";
  value: number | null;
  min_purchase: number | null;
  max_discount: number | null;
  bogo_product_name: string | null;
  description: string;
  is_active: boolean;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface DiscountDetail {
  discount_id: number;
  inventory_id: number | null;
  inventory_name: string | null;
  type: string;
  value: number | null;
  min_purchase: number | null;
  max_discount: number | null;
  bogo_product_id: number | null;
  bogo_product_name: string | null;
  description: string;
  is_active: boolean;
  image: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
}

export interface GetDiscountState {
  discounts: Discount[];
  inventoryNames: InventoryName[];
  inventoryWithoutDiscounts: InventoryName[];
  discountDetail: DiscountDetail;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  sortField: string;
  sortOrder: string;
  search: string;
}

export interface ProductDetail {
  product_id: number;
  product_name: string;
  description: string;
  category_name: string | null;
  price: number;
  availability: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  product_images: {
    image_id: number;
    product_image: string;
    is_primary: boolean;
  }[];
}

export interface Product {
  product_id: number;
  product_name: string;
  category: string | null;
  price: number;
  availability: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ManageProductState {
  products: Product[];
  productDetail: ProductDetail;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
  sortField: string;
  sortOrder: string;
  search: string;
  category: string | null;
  formData: {
    category_id: number;
    product_name: string;
    description: string;
    price: number;
    images: File[];
  };
}

export interface AllCategory {
  category_id: number;
  category_name: string;
}

export interface Category {
  category_id: number;
  category_name: string;
  totalProducts: number;
  is_deleted: boolean;
  created_at: Date;
}

export interface ManageCategoryState {
  category: Category[];
  allCategory: AllCategory[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  editId: number | null;
  loading: boolean;
  error: string | null;
  search: string;
}

export interface UserPaymentState {
  orders: Order[];
  payments: Transaction[];
  vouchers: UserVoucher[];
  loading: boolean;
  error: string | null;
  details: TransactionDetails | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  status: string;
}

export interface Transaction {
  user_id: number;
  order_id: number;
  transaction_id?: string;
  store_name: string;
  order_status: "ORDER_CONFIRMED" | "CANCELLED";
  cart_price: number;
  shipping_price: number;
  total_price?: number;
  shipping_method: string;
  payment_method?: string;
  payment_date?: string;
}

export interface TransactionDetails {
    items: ItemDetails[];
    payment_reference: string | null;
    transaction_id: string
    address: string;
    city_name: string;
    shipping_price: number;
    cart_price: number;
}

export interface ProductImage {
  product_image: string;
  is_primary: boolean;
}

export interface ProductDetailUser {
  inventory_id: number;
  product_id: number;
  product_name: string;
  description: string;
  category_name: string;
  discounted_price: number;
  price: number;
  user_stock: number;
  product_images: ProductImage[];
}

export interface ProductAllUser {
  inventory_id: number;
  product_id: number;
  product_image: string;
  product_name: string;
  category_id: number;
  category_name: string;
  user_stock: number;
  price: number;
  discounted_price: number;
}

export interface getProductsState {
  productDetailUser: ProductDetailUser;
  productAllUser: ProductAllUser[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  sortField: string;
  sortOrder: string;
  search: string;
  category: string | null;
  loading: boolean;
  error: string | null;
}
