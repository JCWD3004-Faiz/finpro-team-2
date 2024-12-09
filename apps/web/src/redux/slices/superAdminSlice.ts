import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { StoreAdmin } from '@/utils/adminInterface';
import axios from 'axios';
import Cookies from 'js-cookie';

// Define initial state
interface SuperAdminState {
  storeAdmins: StoreAdmin[];
  loading: boolean;
  error: string | null;
  isSidebarOpen: boolean;
}

const initialState: SuperAdminState = {
  storeAdmins: [],
  loading: false,
  error: null,
  isSidebarOpen: false,
};

const access_token = Cookies.get('access_token');

// Fetch all store admins
export const fetchStoreAdmins = createAsyncThunk(
  'superAdmin/fetchStoreAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/super-admin/store-admin', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; // return store admins
    } catch (error) {
      return rejectWithValue('Error fetching store admins');
    }
  }
);

// Register a new store admin
export const registerStoreAdmin = createAsyncThunk(
  'superAdmin/registerStoreAdmin',
  async (credentials: { username: string; email: string; password_hash: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/admin-auth/register', {
        ...credentials,
        role: 'STORE_ADMIN',
      });
      return response.data; // return the registered admin
    } catch (error) {
      return rejectWithValue('Error registering admin');
    }
  }
);

// Define the slice
const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreAdmins.fulfilled, (state, action) => {
        state.storeAdmins = action.payload;
        state.loading = false;
      })
      .addCase(fetchStoreAdmins.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(registerStoreAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerStoreAdmin.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerStoreAdmin.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

// Export actions and reducer
export const { toggleSidebar } = superAdminSlice.actions;
export default superAdminSlice.reducer;
