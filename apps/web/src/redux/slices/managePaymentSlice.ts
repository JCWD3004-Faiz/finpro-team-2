import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "@/utils/interceptor";
import Cookies from 'js-cookie';

interface ManagePaymentState {
  payment: any;
  cartItems: any[];
  loading: boolean;
  error: string | null;
  newStatus: string;
  editingStatus: boolean;
  processing: boolean;
}

const initialState: ManagePaymentState = {
  payment: null,
  cartItems: [],
  loading: false,
  error: null,
  newStatus: '',
  editingStatus: false,
  processing: false,
};

const access_token = Cookies.get("access_token");

export const fetchPayment = createAsyncThunk(
  'managePayment/fetchPayment',
  async ({ store_id, payment_id }: { store_id: number; payment_id: number }) => {
    const response = await axios.get(`/api/order/payment/${store_id}/${payment_id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data.payment;
  }
);

export const savePaymentStatus = createAsyncThunk(
  'managePayment/savePaymentStatus',
  async ({ store_id, payment_id, newStatus }: { store_id:number, payment_id: number; newStatus: string }) => {
    const response = await axios.put(`/api/order/payment/${store_id}/${payment_id}`, { 
      payment_status: newStatus }, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data.updatedPayment;
  }
);

export const fetchCartItems = createAsyncThunk(
  'managePayment/fetchCartItems',
  async ({ store_id, order_id }: { store_id: number; order_id: number }) => {
    const response = await axios.get(`/api/order/store-items/${store_id}/${order_id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data.cartItems;
  }
);

export const processOrder = createAsyncThunk(
  'managePayment/processOrder',
  async ({ store_id, order_id }: { store_id: number; order_id: number }) => {
    const response = await axios.put(`/api/order/process/${store_id}/${order_id}`, {}, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.status;
  }
);

export const fetchSuperPayment = createAsyncThunk(
  'managePayment/fetchSuperPayment',
  async ({ payment_id }: { payment_id: number }) => {
    const response = await axios.get(`/api/order/super/${payment_id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data.payment;
  }
);

export const fetchSuperCartItems = createAsyncThunk(
  'managePayment/fetchSuperCartItems',
  async ({ order_id }: { order_id: number }) => {
    const response = await axios.get(`/api/order/super-items/${order_id}`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    return response.data.data.cartItems;
  }
);

const managePaymentSlice = createSlice({
  name: 'managePayment',
  initialState,
  reducers: {
    setNewStatus: (state, action) => {state.newStatus = action.payload},
    setEditingStatus: (state, action) => {state.editingStatus = action.payload},
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayment.pending, (state) => {state.loading = true})
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.newStatus = action.payload.payment_status;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payment details';
      })
      .addCase(fetchCartItems.pending, (state) => {state.loading = true})
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart items';
      })
      .addCase(savePaymentStatus.pending, (state) => {state.loading = true})
      .addCase(savePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
        state.editingStatus = false;
      })
      .addCase(savePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update payment status';
      })
      .addCase(processOrder.pending, (state) => {state.processing = true})
      .addCase(processOrder.fulfilled, (state) => {state.processing = false})
      .addCase(processOrder.rejected, (state) => {
        state.processing = false;
        state.error = 'Failed to process the order';
      })
      .addCase(fetchSuperPayment.pending, (state) => {state.loading = true})
      .addCase(fetchSuperPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(fetchSuperPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch super payment details';
      })
      .addCase(fetchSuperCartItems.pending, (state) => {state.loading = true})
      .addCase(fetchSuperCartItems.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchSuperCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch super cart items';
      });
  },
});

export const { setNewStatus, setEditingStatus } = managePaymentSlice.actions;

export default managePaymentSlice.reducer;
