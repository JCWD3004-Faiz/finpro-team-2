import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError, isAxiosError } from "axios";
import Cookies from "js-cookie";
import {
  getProductsState,
  ProductAllUser,
  ProductDetailUser,
  ProductImage,
} from "@/utils/reduxInterface";

const access_token = Cookies.get("access_token");

const initialProductImage: ProductImage = {
  product_image: "",
  is_primary: false,
};

const initialProductDetail: ProductDetailUser = {
  inventory_id: 0,
  product_id: 0,
  product_name: "",
  description: "",
  category_name: "",
  discounted_price: 0,
  price: 0,
  user_stock: 0,
  product_images: [initialProductImage],
};

const initialState: getProductsState = {
  productDetailUser: initialProductDetail,
  productAllUser: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  sortField: "product_name",
  sortOrder: "asc",
  search: "",
  category: "",
  loading: false,
  error: null,
};

export const fetchProductDetailsByInventoryId = createAsyncThunk(
  "products/fetchProductDetailsByInventoryId",
  async (inventoryId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/users/products/detail/${inventoryId}`
      );
      if (response.status !== 201) {
        throw new Error("Failed to fetch product details.");
      }
      return response.data.inventory; // Ensure this aligns with your API response structure
    } catch (error) {
      if (axioss.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data?.message || "Failed to fetch product details."
        );
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

export const fetchInventoriesUser = createAsyncThunk(
  "inventories/fetchInventoriesUser",
  async (
    {
      //storeId,
      page = 1,
      pageSize = 10,
      search = "",
      category = "",
      sortField = "product_name",
      sortOrder = "asc",
      store_id = 28
    }: {
      //storeId: number;
      page?: number;
      pageSize?: number;
      search?: string;
      category?: string;
      sortField?: string;
      sortOrder?: string;
      store_id?: number
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/users/products/${store_id || 28}?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      return response?.data?.inventories; // Adjust to match your API response structure
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error?.response?.data?.message || "Failed to fetch inventories."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const getProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSortField: (state, action) => {
      state.sortField = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetailsByInventoryId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductDetailsByInventoryId.fulfilled,
        (state, action: PayloadAction<ProductDetailUser>) => {
          state.loading = false;
          state.productDetailUser = action.payload;
        }
      )
      .addCase(
        fetchProductDetailsByInventoryId.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch product details."; // Set the error message
        }
      )
      .addCase(fetchInventoriesUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInventoriesUser.fulfilled,
        (
          state,
          action: PayloadAction<{
            data: ProductAllUser[];
            currentPage: number;
            totalPages: number;
            totalItems: number;
          }>
        ) => {
          state.loading = false;
          state.productAllUser = action.payload.data; // Update the fetched inventories
          state.currentPage = action.payload.currentPage; // Update current page
          state.totalPages = action.payload.totalPages; // Update total pages
          state.totalItems = action.payload.totalItems; // Update total items
        }
      )
      .addCase(fetchInventoriesUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch inventories."; // Set the error message
      });
  },
});

export const {
  setSortField,
  setCurrentPage,
  setSortOrder,
  setSearch,
  setCategory,
} = getProductsSlice.actions
export default getProductsSlice.reducer;
