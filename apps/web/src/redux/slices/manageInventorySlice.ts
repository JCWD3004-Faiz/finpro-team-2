import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
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

export const fetchStoreByStoreId = createAsyncThunk(
  "manageInventory/fetchStoreByStoreId",
  async (storeId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/super-admin/store/${storeId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch store."
        );
      } else {
        return rejectWithValue("An Unexpected error occured.");
      }
    }
  }
);

export const fetchInventoriesByStoreId = createAsyncThunk(
  "manageInventory/fetchInventoriesByStoreId",
  async (
    {
      storeId,
      page = 1,
      sortField = "stock",
      sortOrder = "asc",
      search = ""
    }: {
      storeId: number;
      page?: number;
      sortField?: string;
      sortOrder?: string;
      search?: string
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/inventory/${storeId}?page=${page}&pageSize=10&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`,
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

export const createStockJournal = createAsyncThunk(
    "manageInventory/createStockJournal",
    async (
      { storeId, inventoryIds, stockChange }: { storeId: number; inventoryIds: number[]; stockChange: number },
      { rejectWithValue }
    ) => {
      const access_token = Cookies.get("access_token");
      try {
        const payload = {
          inventories: inventoryIds.map((id) => ({
            inventoryId: id,
            stockChange,
          })),
        };
        const response = await axios.post(
          `/api/inventory/stock-journal/${storeId}`,
          payload,
          {
            headers: { Authorization: `Bearer ${access_token}` },
          }
        );
        return response.data.message; // Assuming the API returns a success message
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          return rejectWithValue(error.response.data.message || "Failed to create stock journal");
        } else {
          return rejectWithValue("An unexpected error occurred.");
        }
      }
    }
  );

const manageInventorySlice = createSlice({
  name: "manageInventory",
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
    toggleSelectedItem(
      state,
      action: PayloadAction<{ inventory_id: number; product_name: string }>
    ) {
      const exists = state.selectedItems.some(
        (item) => item.inventory_id === action.payload.inventory_id
      );
      if (exists) {
        state.selectedItems = state.selectedItems.filter(
          (item) => item.inventory_id !== action.payload.inventory_id
        );
      } else {
        state.selectedItems.push(action.payload);
      }
    },
    selectAllItems(state) {
      state.selectedItems = state.inventories.map((item) => ({
        inventory_id: item.inventory_id,
        product_name: item.Product?.product_name || "Unknown Product",
      }));
    },
    deselectAllItems(state) {
      state.selectedItems = [];
    },
  },
  extraReducers: (builder) => {
    builder
      //fetch store
      .addCase(fetchStoreByStoreId.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload;
      })
      .addCase(fetchStoreByStoreId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreByStoreId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //fetch inventories
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
      })

      //create stock journal
      .addCase(createStockJournal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStockJournal.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload); // You can handle success feedback here
      })
      .addCase(createStockJournal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSortField,
  setSortOrder,
  setCurrentPage,
  toggleSelectedItem,
  selectAllItems,
  deselectAllItems,
} = manageInventorySlice.actions;

export default manageInventorySlice.reducer;
