import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/interceptor';
import Cookies from 'js-cookie';

interface UserProfileState {
  username: string;
  email: string | null;
  is_verified: boolean;
  image: string | null;
  loading: boolean;
  error: string | null;
  locationSuggestions: { city_name: string; city_id: number }[];
  suggestionsPosition: { top: number; left: number; width:number };
  addresses: any[];
}

const initialState: UserProfileState = {
  username: '',
  email: null,
  is_verified: false,
  image: null,
  loading: true,
  error: null,
  locationSuggestions: [],
  suggestionsPosition: { top: 0, left: 0, width: 0},
  addresses: [],
};

const access_token = Cookies.get('access_token');

export const fetchProfile = createAsyncThunk(
  'userProfile/fetchProfile',
  async (user_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/profile/user/${user_id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error fetching profile');
    }
  }
);

export const fetchAddresses = createAsyncThunk(
  'userProfile/fetchAddresses',
  async (user_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/profile/address/${user_id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error fetching addresses');
    }
  }
);

export const addAddress = createAsyncThunk(
  'userProfile/addAddress',
  async ({ user_id, address, city_name, city_id }: { user_id: number; address: string; city_name: string; city_id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/profile/address', { user_id, address, city_name, city_id }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue('Error adding address');
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'userProfile/deleteAddress',
  async ({ user_id, address_id }: { user_id: number; address_id: number }, { rejectWithValue }) => {
    try {
      await axios.put(`/api/profile/address/${user_id}/${address_id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return address_id; // Return the address ID to be removed
    } catch (error) {
      return rejectWithValue('Error deleting address');
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'userProfile/setDefaultAddress',
  async ({ user_id, address_id }: { user_id: number; address_id: number }, { rejectWithValue }) => {
    try {
      await axios.post('/api/profile/default', { user_id, new_address_id: address_id }, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return address_id;
    } catch (error) {
      return rejectWithValue('Error setting default address');
    }
  }
);

const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setLocationSuggestions: (state, action) => { state.locationSuggestions = action.payload; },
    setSuggestionsPosition: (state, action) => { state.suggestionsPosition = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.username = action.payload.username;
        state.is_verified = action.payload.is_verified;
        state.email = action.payload.email;
        state.image = action.payload.image;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAddresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
        state.loading = false;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses.push(action.payload);
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter(address => address.address_id !== action.payload);
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.map(address =>
          address.address_id === action.payload
            ? { ...address, is_default: true }
            : { ...address, is_default: false }
        );
      });
  },
});

export const { setLocationSuggestions, setSuggestionsPosition } = userProfileSlice.actions;

export default userProfileSlice.reducer;
