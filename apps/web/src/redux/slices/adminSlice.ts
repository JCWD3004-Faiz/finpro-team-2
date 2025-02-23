import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';

interface Cashier {
  id: number;
  username: string;
  role: 'cashier';
  status: string;
  lastActive?: string;
  createdAt: string;
  totalSales?: number;
}

interface SalesReport {
  date: string;
  totalTransactions: number;
  totalAmount: number;
  transactions: any[];
}

interface ProductSalesReport {
  startDate: string;
  endDate: string;
  products: {
    product: {
      id: number;
      name: string;
      category: string;
    };
    totalQuantity: number;
    totalAmount: number;
  }[];
}

interface ShiftReport {
  shiftId: number;
  cashier: string;
  startTime: string;
  endTime?: string;
  initialCash: number;
  finalCash?: number;
  totalTransactions: number;
  totalAmount: number;
  debitTotal: number;
}

interface AdminState {
  cashiers: Cashier[];
  dailyReport: SalesReport | null;
  productReport: ProductSalesReport | null;
  shiftReport: ShiftReport[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  cashiers: [],
  dailyReport: null,
  productReport: null,
  shiftReport: [],
  loading: false,
  error: null,
};

// Cashier Management
export const createCashier = createAsyncThunk(
  'admin/createCashier',
  async (data: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/cashiers', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getCashiers = createAsyncThunk(
  'admin/getCashiers',
  async (filters?: { search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/cashiers', { params: filters });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateCashier = createAsyncThunk(
  'admin/updateCashier',
  async ({ id, data }: { id: number; data: Partial<Cashier> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/cashiers/${id}`, data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const deleteCashier = createAsyncThunk(
  'admin/deleteCashier',
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/cashiers/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Reports
export const getDailySalesReport = createAsyncThunk(
  'admin/getDailySalesReport',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/daily', { params: { date } });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getProductSalesReport = createAsyncThunk(
  'admin/getProductSalesReport',
  async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/products', {
        params: { startDate, endDate }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getShiftSalesReport = createAsyncThunk(
  'admin/getShiftSalesReport',
  async (date: string, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/reports/shifts', { params: { date } });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Cashier Management
      .addCase(createCashier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCashier.fulfilled, (state, action) => {
        state.loading = false;
        state.cashiers.push(action.payload);
      })
      .addCase(createCashier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create cashier';
      })
      .addCase(getCashiers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCashiers.fulfilled, (state, action) => {
        state.loading = false;
        state.cashiers = action.payload;
      })
      .addCase(getCashiers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch cashiers';
      })
      .addCase(updateCashier.fulfilled, (state, action) => {
        const index = state.cashiers.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cashiers[index] = action.payload;
        }
      })
      .addCase(deleteCashier.fulfilled, (state, action) => {
        state.cashiers = state.cashiers.filter(c => c.id !== action.payload);
      })
      // Reports
      .addCase(getDailySalesReport.fulfilled, (state, action) => {
        state.dailyReport = action.payload;
      })
      .addCase(getProductSalesReport.fulfilled, (state, action) => {
        state.productReport = action.payload;
      })
      .addCase(getShiftSalesReport.fulfilled, (state, action) => {
        state.shiftReport = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export const adminReducer = adminSlice.reducer;