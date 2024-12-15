import { StoreAdmin, Store } from '@/utils/adminInterface';

export interface SuperAdminState {
    storeAdmins: StoreAdmin[];
    loading: boolean;
    error: string | null;
    isSidebarOpen: boolean;
    allStores: Store[];
    editId: number | null;
    editStoreData: {
      storeName: string;
      locationName: string;
      cityId: number;
    };
    editAdminData: {storeName: string; storeId: number}
    locationSuggestions: { city_name: string; city_id: number }[];
    storeSuggestions: {store_name: string; store_id: number}[];
    suggestionsPosition: { top: number; left: number };
}

export interface StoreAdminState {
    storeName: string;
    storeLocation: string;
    adminName: string;
    loading: boolean;
    error: string | null;
    isSidebarOpen: boolean;
  }