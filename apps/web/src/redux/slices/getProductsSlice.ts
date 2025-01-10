import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError, isAxiosError } from "axios";
import Cookies from "js-cookie";
import {
  getProductsState,
  ProductDetailUser,
  ProductImage,
} from "@/utils/reduxInterface";

const store_id = Cookies.get("storeId");

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

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Define other reducers here if needed
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
      );
  },
});

export default productsSlice.reducer;
