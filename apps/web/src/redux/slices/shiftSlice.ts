import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';

interface Shift {
  id: number;
  cashierId: number;
  startTime: string;
  endTime?: string;
  initialCash: number;
  finalCash?: number;
  expectedCash?: number;
  cashDifference?: number;
  status: 'active' | 'closed';
  transactions: {
    id: number;
    totalAmount: number;
    paymentMethod: 'cash' | 'debit';
  }[];
}

interface ShiftState {
  currentShift: Shift | null;
  shiftHistory: Shift[];
  loading: boolean;
  error: string | null;
}

const initialState: ShiftState = {
  currentShift: null,
  shiftHistory: [],
  loading: false,
  error: null,
};

export const startShift = createAsyncThunk(
  'shift/startShift',
  async (initialCash: number, { rejectWithValue }) => {
    try {
      if (initialCash < 0) {
        return rejectWithValue({ message: 'Initial cash amount cannot be negative' });
      }

      const response = await api.post('/shifts/start', { initialCash });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const endShift = createAsyncThunk(
  'shift/endShift',
  async (finalCash: number, { rejectWithValue }) => {
    try {
      if (finalCash < 0) {
        return rejectWithValue({ message: 'Final cash amount cannot be negative' });
      }

      const response = await api.post('/shifts/end', { finalCash });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getCurrentShift = createAsyncThunk(
  'shift/getCurrentShift',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/shifts/current');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getShiftHistory = createAsyncThunk(
  'shift/getShiftHistory',
  async (filters?: {
    startDate?: string;
    endDate?: string;
    hasDiscrepancy?: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await api.get('/shifts/history', { params: filters });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const shiftSlice = createSlice({
  name: 'shift',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Shift
      .addCase(startShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
      })
      .addCase(startShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to start shift';
      })
      // End Shift
      .addCase(endShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = null;
        state.shiftHistory.unshift(action.payload);
      })
      .addCase(endShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to end shift';
      })
      // Get Current Shift
      .addCase(getCurrentShift.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentShift.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShift = action.payload;
      })
      .addCase(getCurrentShift.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch current shift';
      })
      // Get Shift History
      .addCase(getShiftHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getShiftHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.shiftHistory = action.payload;
      })
      .addCase(getShiftHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch shift history';
      });
  },
});

export const { clearError } = shiftSlice.actions;
export const shiftReducer = shiftSlice.reducer;