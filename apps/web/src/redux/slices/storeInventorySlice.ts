import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { Inventory, Store } from "@/utils/adminInterface";

interface ManageInventoryState {
  store: Store | null;
  inventories: Inventory[];
  selectedItems: { inventory_id: number; product_name: string }[];
  sortField: string;
  sortOrder: string;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  loading: boolean;
  error: string | null;
}

const initialState: ManageInventoryState = {
  store: null,
  inventories: [],
  selectedItems: [],
  sortField: "stock",
  sortOrder: "asc",
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: false,
  error: null,
};

const access_token = Cookies.get("access_token");
const store_id = Cookies.get("storeId");

export const fetchInventoriesByStoreId = createAsyncThunk(
  "storeInventory/fetchInventoriesByStoreId",
  async (
    {
      page = 1,
      sortField = "stock",
      sortOrder = "asc",
      search = "",
    }: {
      page?: number;
      sortField?: string;
      sortOrder?: string;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      if (!store_id) {
        return rejectWithValue("Store ID is missing in cookies.");
      }
      const response = await axios.get(
        `/api/inventory/store/${store_id}?page=${page}&pageSize=10&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data.data; // Return inventories and pagination data
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message ||
            "Failed to fetch inventories for store."
        );
      } else {
        return rejectWithValue("An Unexpected error occured.");
      }
    }
  }
);

const storeInventorySlice = createSlice({
  name: "storeInventory",
  initialState,
  reducers: {
    setSortField(state, action) {
      state.sortField = action.payload;
    },
    setSortOrder(state, action) {
      state.sortOrder = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventoriesByStoreId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoriesByStoreId.fulfilled, (state, action) => {
        state.loading = false;
        state.inventories = action.payload.data || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalItems = action.payload.totalItems || 0;
      })
      .addCase(fetchInventoriesByStoreId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSortField, setSortOrder, setCurrentPage } =
  storeInventorySlice.actions;

export default storeInventorySlice.reducer;
