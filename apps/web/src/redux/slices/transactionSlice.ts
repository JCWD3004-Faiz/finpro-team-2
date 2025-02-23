import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/axios';

interface TransactionItem {
  productId: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    category: string;
    imageUrl?: string;
  };
}

interface Transaction {
  id: number;
  shiftId: number;
  cashierId: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'debit';
  debitCardNumber?: string;
  createdAt: string;
  transactionDetails: TransactionItem[];
}

interface TransactionState {
  currentTransaction: {
    items: TransactionItem[];
    totalAmount: number;
  };
  transactionHistory: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  currentTransaction: {
    items: [],
    totalAmount: 0,
  },
  transactionHistory: [],
  loading: false,
  error: null,
};

export const createTransaction = createAsyncThunk(
  'transaction/createTransaction',
  async (data: {
    shiftId: number;
    items: { productId: number; quantity: number }[];
    paymentMethod: 'cash' | 'debit';
    debitCardNumber?: string;
    cashAmount?: number;
  }, { rejectWithValue }) => {
    try {
      // Validate items
      if (!data.items.length) {
        return rejectWithValue({ message: 'Cart is empty' });
      }

      // Validate debit card
      if (data.paymentMethod === 'debit') {
        if (!data.debitCardNumber) {
          return rejectWithValue({ message: 'Debit card number is required' });
        }
        if (!/^\d{16}$/.test(data.debitCardNumber)) {
          return rejectWithValue({ message: 'Invalid debit card number format' });
        }
      }

      // Validate cash amount
      if (data.paymentMethod === 'cash') {
        if (!data.cashAmount || data.cashAmount <= 0) {
          return rejectWithValue({ message: 'Valid cash amount is required' });
        }
      }

      const response = await api.post('/transactions', data);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getTransactionHistory = createAsyncThunk(
  'transaction/getTransactionHistory',
  async (params: {
    startDate?: string;
    endDate?: string;
    paymentMethod?: 'cash' | 'debit';
    minAmount?: number;
    maxAmount?: number;
  }, { rejectWithValue }) => {
    try {
      const response = await api.get('/transactions', { params });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.currentTransaction.items.find(
        item => item.productId === product.id
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.currentTransaction.items.push({
          productId: product.id,
          quantity,
          price: product.price,
          product: {
            id: product.id,
            name: product.name,
            category: product.category,
            imageUrl: product.imageUrl,
          },
        });
      }

      state.currentTransaction.totalAmount = state.currentTransaction.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    removeItem: (state, action) => {
      const productId = action.payload;
      state.currentTransaction.items = state.currentTransaction.items.filter(
        item => item.productId !== productId
      );
      state.currentTransaction.totalAmount = state.currentTransaction.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    },
    updateItemQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.currentTransaction.items.find(
        item => item.productId === productId
      );
      if (item) {
        item.quantity = quantity;
        state.currentTransaction.totalAmount = state.currentTransaction.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      }
    },
    clearTransaction: (state) => {
      state.currentTransaction = {
        items: [],
        totalAmount: 0,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionHistory.unshift(action.payload);
        state.currentTransaction = {
          items: [],
          totalAmount: 0,
        };
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create transaction';
      })
      .addCase(getTransactionHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTransactionHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactionHistory = action.payload;
      })
      .addCase(getTransactionHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch transaction history';
      });
  },
});

export const {
  addItem,
  removeItem,
  updateItemQuantity,
  clearTransaction,
  clearError,
} = transactionSlice.actions;
export const transactionReducer = transactionSlice.reducer;