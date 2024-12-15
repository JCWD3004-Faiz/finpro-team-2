import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { SuperAdminState } from '@/utils/reduxInterface';
import axios from 'axios';
import Cookies from 'js-cookie';

const initialState: SuperAdminState = {
  storeAdmins: [],
  loading: false,
  error: null,
  isSidebarOpen: false,
  allStores: [],
  editId: null,
  editStoreData: { storeName: '', locationName: '', cityId: 0 },
  editAdminData: {storeName: '', storeId: 0},
  locationSuggestions: [],
  storeSuggestions: [],
  suggestionsPosition: { top: 0, left: 0 },
};

const access_token = Cookies.get('access_token');

export const fetchStoreAdmins = createAsyncThunk('superAdmin/fetchStoreAdmins', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/super-admin/store-admin', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue('Error fetching store admins');
  }
});

export const registerStoreAdmin = createAsyncThunk(
  'superAdmin/registerStoreAdmin',
  async (credentials: { username: string; email: string; password_hash: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/super-admin/register', { ...credentials, role: 'STORE_ADMIN' }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error registering admin');
    }
  }
);

export const fetchAllStores = createAsyncThunk('superAdmin/fetchAllStores', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('/api/super-admin/stores', {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data;
  } catch (error) {
    return rejectWithValue('Error fetching store data.');
  }
});

export const deleteStore = createAsyncThunk('superAdmin/deleteStore', async (store_id: number, { rejectWithValue }) => {
  try {
    await axios.put(`/api/super-admin/delete-store/${store_id}`, {}, { headers: { Authorization: `Bearer ${access_token}` } });
    return store_id;
  } catch (error) {
    return rejectWithValue('Error deleting store');
  }
});

export const updateStore = createAsyncThunk(
  'superAdmin/updateStore',
  async ({ store_id, store_name, store_location, city_id }: { store_id: number; store_name: string; store_location: string; city_id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/super-admin/update-store/${store_id}`, { store_name, store_location, city_id }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error updating store');
    }
  }
);

export const assignStoreAdmin = createAsyncThunk(
  'superAdmin/assignAdmin',
  async ({ store_id, user_id }: { store_id:number; user_id: number}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/super-admin/assign`, { user_id, store_id }, { 
        headers: { Authorization: `Bearer ${access_token}` } });
      return response.data;
    } catch (error) {
      return rejectWithValue('Error assigning admin');
    }
  }
)

export const deleteStoreAdmin = createAsyncThunk('superAdmin/deleteStoreAdmin', async (user_id:number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/super-admin/delete-admin/${user_id}`, { headers: { Authorization: `Bearer ${access_token}` } });
      return user_id;
    } catch (error) {
      return rejectWithValue('Error deleting admin');
    }
  }
)


const asyncActionHandler = (state: SuperAdminState, action: any, successCallback?: (state: SuperAdminState, action: any) => void) => {
  state.loading = action.type.endsWith('pending');
  if (action.type.endsWith('rejected')) {
    state.error = action.payload as string;
  } else if (action.type.endsWith('fulfilled') && successCallback) {
    successCallback(state, action);
  }
};

const superAdminSlice = createSlice({
  name: 'superAdmin',
  initialState,
  reducers: {
    toggleSidebar: (state) => { state.isSidebarOpen = !state.isSidebarOpen; },
    setEditId: (state, action) => { state.editId = action.payload; },
    setEditStoreData: (state, action) => { state.editStoreData = action.payload },
    setEditAdminData: (state, action) => { state.editAdminData = action.payload },
    setLocationSuggestions: (state, action) => { state.locationSuggestions = action.payload; },
    setStoreSuggestions: (state, action) => { state.storeSuggestions = action.payload },
    setSuggestionsPosition: (state, action) => { state.suggestionsPosition = action.payload; },
    resetEditState: (state) => { state.editId = null; state.locationSuggestions = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStoreAdmins.pending, (state) => asyncActionHandler(state, { type: 'fetchStoreAdmins/pending' }))
      .addCase(fetchStoreAdmins.fulfilled, (state, action) => asyncActionHandler(state, action, (state, action) => {
        state.storeAdmins = action.payload;
      }))
      .addCase(fetchStoreAdmins.rejected, (state, action) => asyncActionHandler(state, action))

      .addCase(registerStoreAdmin.pending, (state) => asyncActionHandler(state, { type: 'registerStoreAdmin/pending' }))
      .addCase(registerStoreAdmin.fulfilled, (state) => asyncActionHandler(state, { type: 'registerStoreAdmin/fulfilled' }))
      .addCase(registerStoreAdmin.rejected, (state, action) => asyncActionHandler(state, action))

      .addCase(fetchAllStores.pending, (state) => asyncActionHandler(state, { type: 'fetchAllStores/pending' }))
      .addCase(fetchAllStores.fulfilled, (state, action) => asyncActionHandler(state, action, (state, action) => {
        state.allStores = action.payload;
      }))
      .addCase(fetchAllStores.rejected, (state, action) => asyncActionHandler(state, action))

      .addCase(deleteStore.pending, (state) => asyncActionHandler(state, { type: 'deleteStore/pending' }))
      .addCase(deleteStore.fulfilled, (state, action) => asyncActionHandler(state, action, (state, action) => {
        state.allStores = state.allStores.filter(store => store.store_id !== action.payload);
      }))
      .addCase(deleteStore.rejected, (state, action) => asyncActionHandler(state, action))

      .addCase(updateStore.pending, (state) => asyncActionHandler(state, { type: 'updateStore/pending' }))
      .addCase(updateStore.fulfilled, (state, action) => asyncActionHandler(state, action, (state, action) => {
        const updatedStore = action.payload;
        state.allStores = state.allStores.map(store =>
          store.store_id === updatedStore.store_id ? updatedStore : store
        );
      }))
      .addCase(updateStore.rejected, (state, action) => asyncActionHandler(state, action))

      .addCase(assignStoreAdmin.pending, (state) => asyncActionHandler(state, { type: 'assignAdmin/pending' }))
      .addCase(assignStoreAdmin.fulfilled, (state, action) => asyncActionHandler(state, action, (state, action) => {
        const assignedAdmin = action.payload;
        state.storeAdmins = state.storeAdmins.map(admin =>
          admin.user_id === assignedAdmin.user_id ? assignedAdmin : admin
        );
      }))
      .addCase(assignStoreAdmin.rejected, (state, action) => asyncActionHandler(state, action))

      .addCase(deleteStoreAdmin.pending, (state) => asyncActionHandler(state, { type: 'deleteStoreAdmin/pending' }))
      .addCase(deleteStoreAdmin.fulfilled, (state, action) => asyncActionHandler(state, action, (state, action) => {
        const userIdToDelete = action.payload;
        state.storeAdmins = state.storeAdmins.filter(admin => admin.user_id !== userIdToDelete);
      }))
      .addCase(deleteStoreAdmin.rejected, (state, action) => asyncActionHandler(state, action));
  },
});

export const { toggleSidebar, setEditId, setEditStoreData, setEditAdminData, setLocationSuggestions, setStoreSuggestions, setSuggestionsPosition, resetEditState } = superAdminSlice.actions;
export default superAdminSlice.reducer;
