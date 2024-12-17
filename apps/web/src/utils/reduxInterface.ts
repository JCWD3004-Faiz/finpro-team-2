import { StoreAdmin, Store } from '@/utils/adminInterface';

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
  }