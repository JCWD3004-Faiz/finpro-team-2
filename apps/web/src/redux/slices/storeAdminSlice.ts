import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "@/utils/interceptor"
import Cookies from 'js-cookie';
import { StoreAdminState } from '@/utils/reduxInterface';

const initialState: StoreAdminState = {
  storeName: '',
  storeLocation: '',
  adminName: '',
  loading: true,
  error: null, 
  isSidebarOpen: false,
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
      .addCase(fetchAdminById.rejected, (state, action) => handleAsyncState(state, action));
  },
});

export const { resetState, toggleSidebar } = storeAdminSlice.actions;
export default storeAdminSlice.reducer;
