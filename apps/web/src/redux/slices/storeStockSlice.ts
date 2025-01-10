import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

interface StocksData {
  journal_id: number;
  inventory_id: number;
  inventory_name: string;
  store_name: string;
  change_type: string;
  change_quantity: number;
  prev_stock: number;
  new_stock: number;
  change_category: string;
  created_at: Date;
}

interface storeStockState {
  stocksData: StocksData[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  sortOrder: string;
  search: string;
  storeId: number;
  loading: boolean;
  error: string | null;
}

const initialState: storeStockState = {
  stocksData: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  sortOrder: "asc",
  search: "",
  storeId: 0,
  loading: false,
  error: null,
};

const access_token = Cookies.get("access_token");
const store_id = Cookies.get("storeId");

export const fetchStocksStore = createAsyncThunk(
  "storeStock/fetchStocksStore",
  async (
    {
      page = 1,
      search = "",
    }: {
      page?: number;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (!store_id) {
        return rejectWithValue("Store ID is missing in cookies.");
      }
      const response = await axios.get(
        `/api/store-admin/stocks?store_id=${store_id}&page=${page}&sortOrder&changeType&search=${search}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch products."
        );
      } else {
        return rejectWithValue("An Unexpected error occured.");
      }
    }
  }
);

const storeStockSlice = createSlice({
  name: "storeStock",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setSortOrder(state, action: PayloadAction<string>) {
      state.sortOrder = action.payload;
    },
    setStoreId(state, action: PayloadAction<number>) {
      state.storeId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending case
      .addCase(fetchStocksStore.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on a new fetch
      })
      // Fulfilled case
      .addCase(
        fetchStocksStore.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.stocksData = action.payload.data; // Assuming the API returns an array of stock entries
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalItems = action.payload.totalItems;
          state.loading = false; // Set loading to false once data is successfully fetched
        }
      )
      // Rejected case
      .addCase(
        fetchStocksStore.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false; // Stop loading if an error occurs
          state.error = action.payload || "Failed to fetch stocks.";
        }
      );
  },
});

export const { setSearch, setSortOrder, setStoreId } = storeStockSlice.actions;

export default storeStockSlice.reducer;
