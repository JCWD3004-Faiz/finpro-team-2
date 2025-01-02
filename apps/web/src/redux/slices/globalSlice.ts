import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "@/utils/interceptor"

interface City {
  city_name: string;
  city_id: number;
}

interface GlobalState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const initialState: GlobalState = {
  cities: [],
  loading: false,
  error: null,
};

export const fetchCities = createAsyncThunk('global/fetchCities', async () => {
  try {
    const response = await axios.get('/api/profile/cities');
    return response.data.data;
  } catch (error) {
    throw new Error('Error fetching city data');
  }
});

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload;
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cities';
      });
  },
});

export default globalSlice.reducer;
