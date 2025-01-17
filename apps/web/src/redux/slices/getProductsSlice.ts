import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError } from "axios";
import Cookies from "js-cookie";
import {
  getProductsState,
  ProductAllUser,
  ProductDetailUser,
  ProductImage,
} from "@/utils/reduxInterface";

const store_id = Cookies.get("storeId");
const access_token = Cookies.get("access_token");
const current_store_id = Cookies.get("current_store_id");

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
  categories: [], // Added categories state
  loading: false,
  error: null,
};

// Fetch product details by inventory ID
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
      return response.data.inventory;
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

// Fetch paginated inventories
export const fetchInventoriesUser = createAsyncThunk(
  "inventories/fetchInventoriesUser",
  async (
    {
      page = 1,
      pageSize = 10,
      search = "",
      category = "",
      sortField = "product_name",
      sortOrder = "asc",
    }: {
      page?: number;
      pageSize?: number;
      search?: string;
      category?: string;
      sortField?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/users/products/${current_store_id}?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );

      return response.data.inventories;
    } catch (error) {
      if (axioss.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch inventories."
        );
      }
      return rejectWithValue("An unexpected error occurred.");
    }
  }
);

// Fetch all categories
export const fetchAllCategories = createAsyncThunk(
  "products/fetchAllCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/users/categories`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; // Assuming the API returns an array of category names
    } catch (error) {
      if (axioss.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch categories."
        );
      }
      return rejectWithValue("An unexpected error occurred.");
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
      // Fetch product details
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
          state.error = action.payload || "Failed to fetch product details.";
        }
      )
      // Fetch inventories
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
          state.productAllUser = action.payload.data;
          state.currentPage = action.payload.currentPage;
          state.totalPages = action.payload.totalPages;
          state.totalItems = action.payload.totalItems;
        }
      )
      .addCase(fetchInventoriesUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch inventories.";
      })
      // Fetch all categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllCategories.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.loading = false;
          state.categories = action.payload; // Update categories state
        }
      )
      .addCase(fetchAllCategories.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories.";
      });
  },
});

export const {
  setSortField,
  setCurrentPage,
  setSortOrder,
  setSearch,
  setCategory,
} = getProductsSlice.actions;
export default getProductsSlice.reducer;

