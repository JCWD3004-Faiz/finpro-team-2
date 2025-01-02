import { StoreAdmin, Store, Order } from '@/utils/adminInterface';

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
