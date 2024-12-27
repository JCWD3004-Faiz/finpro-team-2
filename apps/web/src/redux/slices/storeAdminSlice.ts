import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "@/utils/interceptor"
import Cookies from 'js-cookie';
import { StoreAdminState } from '@/utils/reduxInterface';
import { OrderStatus } from '@/utils/adminInterface';

const initialState: StoreAdminState = {
  storeName: '',
  storeLocation: '',
  adminName: '',
  loading: true,
  error: null, 
  isSidebarOpen: false,
  storeOrders: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  sortField: "created_at",
  orderStatus: "",
};

const access_token = Cookies.get('access_token');

export const fetchStoreByUserId = createAsyncThunk(
  'storeAdmin/fetchStoreByUserId',
  async (userId: number, { rejectWithValue }) => {
    if (typeof window === "undefined") {
      return rejectWithValue("Cannot fetch data during SSR")}
    try {
      const response = await axios.get(`/api/store-admin/assigned-store/${userId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      Cookies.set('storeId', response.data.data.store_id, { expires: 7, path: '/admin-store' })
      return response.data.data; 
      
    } catch (error) {
      return rejectWithValue('Store not found for your account.');
    }
  }
);

export const fetchStoreByStoreId = createAsyncThunk(
  'storeAdmin/fetchStoreByStoreId',
  async (storeId: number, { rejectWithValue }) => {
    if (typeof window === "undefined") {
      return rejectWithValue("Cannot fetch data during SSR")}
    try {
      const response = await axios.get(`/api/store-admin/store/${storeId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue('Error fetching store data.');
    }
  }
);

export const fetchAdminById = createAsyncThunk(
  'storeAdmin/fetchAdminById',
  async (userId: number, { rejectWithValue }) => {
    if (typeof window === "undefined") {
      return rejectWithValue("Cannot fetch data during SSR")}
    try {
      const response = await axios.get(`/api/store-admin/admin/${userId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; 
    } catch (error) {
      return rejectWithValue('Error fetching admin data.');
    }
  }
);

export const fetchStoreOrders = createAsyncThunk('storeAdmin/fetchStoreOrders',
  async ({
    storeId,
    page = 1,
    sortField = "created_at",
    sortOrder = "asc",
    search = "",
    orderStatus
  }: {
    storeId: number;
    page?: number;
    sortField?: string;
    sortOrder?: string;
    search?: string;
    orderStatus: string;
  }, { rejectWithValue }) => {
    if (typeof window === "undefined") {
      return rejectWithValue("Cannot fetch data during SSR")}
    try {
      const response = await axios.get(`/api/order/store/${storeId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
        params: { page, sortField, sortOrder, search, orderStatus },
      });
      return response.data; 
    } catch (error) {
      return rejectWithValue('Error fetching store orders.');
    }
  }
)

const handleAsyncState = (state: StoreAdminState, action: any) => {
  state.loading = false;
  if (action.error) {
    state.error = action.error.message || 'Unknown error';
  } else if (action.payload) {
    const { store_name, store_location, username } = action.payload;
    if (store_name && store_location) {
      state.storeName = store_name;
      state.storeLocation = store_location;
    }
    if (username) {
      state.adminName = username;
    }
  }
};

const storeAdminSlice = createSlice({
  name: 'storeAdmin',
  initialState,
  reducers: {
    resetState: (state) => {
      state.storeName = '';
      state.storeLocation = '';
      state.adminName = '';
      state.loading = true;
      state.error = null; 
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSortField(state, action) { state.sortField = action.payload},
    setCurrentPage(state, action) {state.currentPage = action.payload;},
    setOrderStatus(state, action) { state.orderStatus = action.payload;}
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreByUserId.pending, (state) => {state.loading = true})
      .addCase(fetchStoreByUserId.fulfilled, (state, action) => handleAsyncState(state, action))
      .addCase(fetchStoreByUserId.rejected, (state, action) => handleAsyncState(state, action))
      .addCase(fetchStoreByStoreId.pending, (state) => {state.loading = true})
      .addCase(fetchStoreByStoreId.fulfilled, (state, action) => handleAsyncState(state, action))
      .addCase(fetchStoreByStoreId.rejected, (state, action) => handleAsyncState(state, action))
      .addCase(fetchAdminById.pending, (state) => {state.loading = true})
      .addCase(fetchAdminById.fulfilled, (state, action) => handleAsyncState(state, action))
      .addCase(fetchAdminById.rejected, (state, action) => handleAsyncState(state, action))
      .addCase(fetchStoreOrders.pending, (state) => {state.loading = true})
      .addCase(fetchStoreOrders.fulfilled, (state, action) => {
        state.loading = false;
        const { orders, currentPage, totalPages, totalItems } = action.payload.order_data;
        state.storeOrders = orders;
        state.totalPages = totalPages;
        state.totalItems = totalItems;
        state.currentPage = currentPage;
      })
      .addCase(fetchStoreOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetState, toggleSidebar, setCurrentPage, setSortField, setOrderStatus } = storeAdminSlice.actions;
export default storeAdminSlice.reducer;
