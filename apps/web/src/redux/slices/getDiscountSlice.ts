import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { DiscountDetail, GetDiscountState } from "@/utils/reduxInterface";

const initialDiscountDetail: DiscountDetail = {
  discount_id: 0,
  inventory_id: 0,
  inventory_name: "",
  type: "",
  value: 0,
  min_purchase: 0,
  max_discount: 0,
  bogo_product_id: 0,
  bogo_product_name: "",
  description: "",
  is_active: false,
  image: "",
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
};

const initialState: GetDiscountState = {
  discounts: [],
  inventoryNames: [],
  inventoryWithoutDiscounts: [],
  discountDetail: initialDiscountDetail,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: false,
  error: null,
  sortField: "start_date",
  sortOrder: "asc",
  search: "",
};

const access_token = Cookies.get("access_token");

export const fetchDiscountsAdmin = createAsyncThunk(
  "discounts/fetchDiscountsAdmin",
  async (
    {
      storeId,
      page = 1,
      pageSize = 10,
      search = "",
      sortField = "start_date",
      sortOrder = "asc",
    }: {
      storeId: number;
      page?: number;
      pageSize?: number;
      search?: string;
      sortField?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/store-admin/discounts/${storeId}?page=${page}&pageSize=${pageSize}&search=${search}&sortField=${sortField}&sortOrder=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      return response.data.discounts;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch discounts."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchInventoryNamesAdmin = createAsyncThunk(
  "discounts/fetchInventoryNamesAdmin",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/store-admin/inventories/${storeId}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch inventory names."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchInventoryWithoutDiscountsAdmin = createAsyncThunk(
  "discounts/fetchInventoryWithoutDiscountsAdmin",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/store-admin/inventories/discounts/${storeId}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch inventory names."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchDiscountDetails = createAsyncThunk(
  "discounts/fetchDiscountDetails",
  async (discountId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/store-admin/discounts/details/${discountId}`
      );
      return response.data.discount as DiscountDetail;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch discount details."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const discountsSlice = createSlice({
  name: "discounts",
  initialState,
  reducers: {
    setSortField(state, action) {
      state.sortField = action.payload;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.discounts = action.payload.data;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchDiscountsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInventoryNamesAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInventoryNamesAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryNames = action.payload;
      })
      .addCase(fetchInventoryNamesAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInventoryWithoutDiscountsAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchInventoryWithoutDiscountsAdmin.fulfilled,
        (state, action) => {
          state.loading = false;
          state.inventoryWithoutDiscounts = action.payload;
        }
      )
      .addCase(
        fetchInventoryWithoutDiscountsAdmin.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload as string;
        }
      )
      .addCase(fetchDiscountDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscountDetails.fulfilled,
        (state, action: PayloadAction<DiscountDetail>) => {
          state.discountDetail = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchDiscountDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setSortField, setCurrentPage, setSortOrder, setSearch } =
  discountsSlice.actions;
export default discountsSlice.reducer;
