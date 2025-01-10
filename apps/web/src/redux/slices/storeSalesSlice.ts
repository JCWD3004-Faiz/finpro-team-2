import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

const access_token = Cookies.get("access_token");
const store_id = Cookies.get("storeId");

interface Dataset {
  label: string;
  data: number[];
}

interface SalesByCategoryData {
  labels: string[];
  datasets: Dataset[];
}

interface SalesData {
  month: string;
  total_sales: number;
}

interface SalesByProductData {
  month: string;
  total_sales: number;
}

interface SalesState {
  sales: SalesData[];
  categories: { category_id: number; category_name: string }[];
  products: { product_id: number; product_name: string }[];
  stores: { store_id: number; store_name: string }[];
  store_id: number | null;
  category_id: number | null;
  product_id: number | null;
  loading: boolean;
  error: string | null;
  salesByCategory: SalesByCategoryData;
  salesByProductData: SalesByProductData[];
}

// Initial state
const initialState: SalesState = {
  sales: [],
  categories: [],
  products: [],
  stores: [],
  store_id: null,
  category_id: null,
  product_id: null,
  loading: false,
  error: null,
  salesByCategory: {
    labels: [],
    datasets: [],
  },
  salesByProductData: [],
};

// Async thunk to fetch sales data
export const fetchSalesData = createAsyncThunk(
  "sales/fetchSalesData",
  async ({ year }: { year: number }, { rejectWithValue }) => {
    try {
      if (!store_id) {
        return rejectWithValue("Store ID is missing in cookies.");
      }
      const response = await axios.get(
        `/api/store-admin/sales/?year=${year}&store_id=${store_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data.data; // Assuming `data` contains the sales array
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to fetch sales data."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchSalesByProductData = createAsyncThunk(
  "sales/fetchSalesByProductData",
  async (
    { year, product_id }: { year: number; product_id?: number },
    { rejectWithValue }
  ) => {
    try {
      if (!store_id) {
        return rejectWithValue("Store ID is missing in cookies.");
      }
      const response = await axios.get(
        `/api/store-admin/sales/products/?year=${year}&store_id=${store_id}&product_id=${product_id}`,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data.data; // Assuming `data` contains the sales array
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to fetch sales data."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchCategoriesProductStoreData = createAsyncThunk(
  "storeAdmin/fetchCategoriesProductStoreData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/store-admin/data/all", {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to data."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchSalesByCategory = createAsyncThunk(
  "sales/fetchSalesByCategory",
  async (
    { year, category_id }: { year: number; category_id?: number | null },
    { rejectWithValue }
  ) => {
    try {
      if (!store_id) {
        return rejectWithValue("Store ID is missing in cookies.");
      }
      const response = await axios.get("/api/store-admin/sales/categories/", {
        params: {
          year,
          ...(store_id ? { store_id } : {}),
          ...(category_id ? { category_id } : {}),
        },
        headers: {
          Authorization: `Bearer ${access_token}`, // Include the token if necessary
        },
      });

      return response.data.data; // Return only the data field
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response?.data?.message || "Failed to fetch sales by category."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

// Create the slice
const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setStoreId(state, action: PayloadAction<number | null>) {
      state.store_id = action.payload;
    },
    setCategoryId(state, action: PayloadAction<number | null>) {
      state.category_id = action.payload;
    },
    setProductId(state, action: PayloadAction<number | null>) {
      state.product_id = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSalesData.fulfilled,
        (state, action: PayloadAction<SalesData[]>) => {
          state.loading = false;
          state.sales = action.payload;
        }
      )
      .addCase(fetchSalesData.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSalesByProductData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSalesByProductData.fulfilled,
        (state, action: PayloadAction<SalesByProductData[]>) => {
          state.loading = false;
          state.salesByProductData = action.payload;
        }
      )
      .addCase(
        fetchSalesByProductData.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      )
      .addCase(fetchCategoriesProductStoreData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoriesProductStoreData.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.products = action.payload.products;
        state.stores = action.payload.stores;
      })
      .addCase(fetchCategoriesProductStoreData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSalesByCategory.pending, (state) => {
        state.loading = true;
        state.error = null; // Clear any previous errors
      })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.salesByCategory = {
          labels: action.payload.labels || [], // Labels from the API response
          datasets: action.payload.datasets || [], // Datasets from the API response
        };
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to fetch sales by category.";
      });
  },
});

export const { setStoreId, setCategoryId, setProductId } = salesSlice.actions;
export default salesSlice.reducer;
