import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { storeId } from "@/hooks/useCheckAccess";

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

interface superStockState {
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

const initialState: superStockState = {
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

export const fetchStocksSuper = createAsyncThunk(
  "superStock/fetchStocksSuper",
  async (
    {
      page = 1,
      search = "",
      storeId,
    }: {
      page?: number;
      search?: string;
      storeId: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/super-admin/stocks?store_id=${storeId}&page=${page}&sortOrder&changeType&search=${search}`,
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

const superStockSlice = createSlice({
    name: "superStock",
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
      setCurrentPage(state, action) {
        state.currentPage = action.payload;
      },
    },
    extraReducers: (builder) => {
      builder
        // Pending case
        .addCase(fetchStocksSuper.pending, (state) => {
          state.loading = true;
          state.error = null; // Reset error on a new fetch
        })
        // Fulfilled case
        .addCase(fetchStocksSuper.fulfilled, (state, action: PayloadAction<any>) => {
          state.stocksData = action.payload.data; // Assuming the API returns an array of stock entries
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalItems = action.payload.totalItems;
          state.loading = false; // Set loading to false once data is successfully fetched
        })
        // Rejected case
        .addCase(fetchStocksSuper.rejected, (state, action: PayloadAction<any>) => {
          state.loading = false; // Stop loading if an error occurs
          state.error = action.payload || "Failed to fetch stocks.";
        });
    },
  });
  
  export const { setSearch, setSortOrder, setStoreId, setCurrentPage } = superStockSlice.actions;
  
  export default superStockSlice.reducer;
