import { StoreAdmin, Store, Order } from '@/utils/adminInterface';
import { ItemDetails } from '@/components/transaction-details';

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
    editAdminData: {storeName: string; storeId: number}
    locationSuggestions: { city_name: string; city_id: number }[];
    storeSuggestions: {store_name: string; store_id: number, store_admin:string}[];
    suggestionsPosition: { top: number; left: number; width:number };
    allStores: Store[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
    sortField: string;
    sortFieldAdmin: string; 
    sortFieldOrder: string;
    orderStatus: string,
    allOrders: Order[];
    storeName: string,
    storeNames: string[]
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


export interface ProductDetail {
  product_id: number;
  product_name: string;
  description: string;
  category_name: string | null;
  price: number;
  availability: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
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
    category_id: number,
    product_name: string,
    description: string,
    price: number,
    images: File[],
  },
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
  loading: boolean;
  error: string | null;
  details: TransactionDetails | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  status: string
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
    address: string;
    city_name: string;
    shipping_price: number;
    cart_price: number;
}
