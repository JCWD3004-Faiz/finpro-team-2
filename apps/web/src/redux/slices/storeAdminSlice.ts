import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define initial state
interface StoreAdminState {
  storeName: string;
  storeLocation: string;
  adminName: string;
  loading: boolean;
  error: string | null; // Ensure error is either a string or null
  isSidebarOpen: boolean; // Add sidebar state
}

const initialState: StoreAdminState = {
  storeName: '',
  storeLocation: '',
  adminName: '',
  loading: true,
  error: null, // Initialize error as null
  isSidebarOpen: false, // Initial state for sidebar
};

const access_token = Cookies.get('access_token');

// Fetch store by user ID
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
      return response.data.data; // return store data
      
    } catch (error) {
      return rejectWithValue('Store not found for your account.');
    }
  }
);

// Fetch store by store ID
export const fetchStoreByStoreId = createAsyncThunk(
  'storeAdmin/fetchStoreByStoreId',
  async (storeId: number, { rejectWithValue }) => {
    if (typeof window === "undefined") {
      return rejectWithValue("Cannot fetch data during SSR")}
    try {
      const response = await axios.get(`/api/store-admin/store/${storeId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; // return store data
    } catch (error) {
      return rejectWithValue('Error fetching store data.');
    }
  }
);

// Fetch admin by ID
export const fetchAdminById = createAsyncThunk(
  'storeAdmin/fetchAdminById',
  async (userId: number, { rejectWithValue }) => {
    if (typeof window === "undefined") {
      return rejectWithValue("Cannot fetch data during SSR")}
    try {
      const response = await axios.get(`/api/store-admin/admin/${userId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; // return admin data
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

// Define the slice
const storeAdminSlice = createSlice({
  name: 'storeAdmin',
  initialState,
  reducers: {
    resetState: (state) => {
      state.storeName = '';
      state.storeLocation = '';
      state.adminName = '';
      state.loading = true;
      state.error = null; // Reset error to null
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen; // Toggle sidebar state
    },
  },
  extraReducers: (builder) => {
    builder
      // Store fetched via user ID
      .addCase(fetchStoreByUserId.pending, (state) => {state.loading = true})
      .addCase(fetchStoreByUserId.fulfilled, (state, action) => handleAsyncState(state, action))
      .addCase(fetchStoreByUserId.rejected, (state, action) => handleAsyncState(state, action))
      
      // Store fetched via store ID
      .addCase(fetchStoreByStoreId.pending, (state) => {state.loading = true})
      .addCase(fetchStoreByStoreId.fulfilled, (state, action) => handleAsyncState(state, action))
      .addCase(fetchStoreByStoreId.rejected, (state, action) => handleAsyncState(state, action))
      
      // Admin data fetch
      .addCase(fetchAdminById.pending, (state) => {state.loading = true})
      .addCase(fetchAdminById.fulfilled, (state, action) => handleAsyncState(state, action))
      .addCase(fetchAdminById.rejected, (state, action) => handleAsyncState(state, action));
  },
});

// Export actions and reducer
export const { resetState, toggleSidebar } = storeAdminSlice.actions;
export default storeAdminSlice.reducer;
