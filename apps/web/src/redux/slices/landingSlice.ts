import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/interceptor';
import Cookies from 'js-cookie';

interface LandingState {
  location: { lat: number | null; lon: number | null } | null;
  closestStore: any | null;
  error: string | null;
}

const initialState: LandingState = {
  location: null,
  closestStore: null,
  error: null,
};

const access_token = Cookies.get('access_token');


export const fetchClosestStore = createAsyncThunk(
  'landing/fetchClosestStore',
  async (location: { lat: number; lon: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/profile/closest-store', {
        latitude: location.lat,
        longitude: location.lon,
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch closest store');
    }
  }
);

export const fetchClosestStoreById = createAsyncThunk(
    'landing/fetchClosestStoreById',
  async (user_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/profile/closest-store/${user_id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user details');
    }
  }
)

// Create the slice
const landingSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{ lat: number; lon: number }>) => {
      state.location = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetStore: (state) => {
      state.closestStore = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClosestStore.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchClosestStore.fulfilled, (state, action) => {
        state.closestStore = action.payload;
        state.error = null;
      })
      .addCase(fetchClosestStore.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchClosestStoreById.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchClosestStoreById.fulfilled, (state, action) => {
        state.closestStore = action.payload;
        state.error = null;
      })
      .addCase(fetchClosestStoreById.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setLocation, setError, resetStore } = landingSlice.actions;

export default landingSlice.reducer;
