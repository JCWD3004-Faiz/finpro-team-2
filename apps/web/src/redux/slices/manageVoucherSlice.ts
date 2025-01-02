import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from '@/utils/interceptor';
import Cookies from 'js-cookie';
import { Voucher } from '@/utils/adminInterface';

interface ManageVoucherState {
  vouchers: Voucher[];
  sortField: string;
  loading: boolean;
  error: string | null;
  totalPages: number;
  voucherType: string;
  discountType: string;
}

const initialState: ManageVoucherState = {
  vouchers: [],
  sortField: 'discount_amount',
  loading: false,
  error: null,
  totalPages: 1,
  voucherType: "",
  discountType: ""
};

const access_token = Cookies.get('access_token');

export const fetchVouchers = createAsyncThunk(
    'manageVoucher/fetchVouchers',
    async ({ page = 1, sortField = "discount_amount", sortOrder = "asc", search ="", voucherType, discountType }: 
        { page: number; sortField: string; sortOrder: string; search: string, voucherType:string, discountType:string }, { rejectWithValue }) => {
      try {
        const { data } = await axios.get('/api/super-admin/vouchers', {
          headers: { Authorization: `Bearer ${access_token}` },
          params: { page, sortField, sortOrder, search, voucherType, discountType},
        });
        return { vouchers: data.data, totalPages: data.pagination.totalPages }; 
      } catch (error) {
        return rejectWithValue(error);
      }
    }
);

export const deleteVoucher = createAsyncThunk(
    'manageVoucher/deleteVoucher',
    async (voucher_id: number, { rejectWithValue }) => {
        try {
        await axios.put(`/api/super-admin/voucher/${voucher_id}`, {}, { headers: { Authorization: `Bearer ${access_token}` } });
        return voucher_id;
      } catch (error) {
        return rejectWithValue('Error deleting voucher');
    }
    }
);

export const editVoucher = createAsyncThunk(
  'manageVoucher/editVoucher',
  async (voucherData: {
    voucher_id: number;
    voucher_type: string;
    discount_type: string;
    discount_amount: number;
    expire_period: number;
    min_purchase?: number;
    max_discount?: number;
    description?: string;
  }, { rejectWithValue }) => {
    try {
      const { data } = await axios.patch(`/api/super-admin/voucher/${voucherData.voucher_id}`, voucherData, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return data;
    } catch (error:any) {
      return rejectWithValue('Error editing voucher');
    }
  }
);

const manageVoucherSlice = createSlice({
    name: 'manageVoucher',
    initialState,
    reducers: {
      setSortField: (state, action: PayloadAction<string>) => { state.sortField = action.payload },
      setTotalPages: (state, action: PayloadAction<number>) => { state.totalPages = action.payload },
      setVoucherType(state, action) { state.voucherType = action.payload; },
      setDiscountType(state, action) { state.discountType = action.payload; },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchVouchers.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchVouchers.fulfilled, (state, action: PayloadAction<{ vouchers: Voucher[]; totalPages: number }>) => {
          state.vouchers = action.payload.vouchers;
          state.totalPages = action.payload.totalPages;
          state.loading = false;
        })
        .addCase(fetchVouchers.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(deleteVoucher.pending, (state) => {
          state.loading = true;
        })
        .addCase(deleteVoucher.fulfilled, (state, action: PayloadAction<number>) => {
          state.vouchers = state.vouchers.filter(voucher => voucher.voucher_id!== action.payload);
        })
        .addCase(deleteVoucher.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        })
        .addCase(editVoucher.pending, (state) => {
          state.loading = true;
        })
        .addCase(editVoucher.fulfilled, (state, action: PayloadAction<any>) => {
          state.loading = false;
          const updatedVoucherIndex = state.vouchers.findIndex(voucher => voucher.voucher_id === action.payload.voucher_id);
          if (updatedVoucherIndex !== -1) {
            state.vouchers[updatedVoucherIndex] = action.payload;
          }
        })
        .addCase(editVoucher.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        });
    }
});

export const { setSortField, setTotalPages, setVoucherType, setDiscountType } = manageVoucherSlice.actions;
export default manageVoucherSlice.reducer;
