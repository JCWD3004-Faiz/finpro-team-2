import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ManageProductState, ProductDetail, fieldEndpointMap } from "@/utils/reduxInterface";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { WritableDraft } from "immer";

const initialProductDetail: ProductDetail = {
  product_id: 0,
  product_name: "",
  description: "",
  category_name: null,
  price: 0,
  availability: false,
  is_deleted: false,
  created_at: new Date(),
  updated_at: new Date(),
  product_images: [],
};

const initialState: ManageProductState = {
  products: [],
  productDetail: initialProductDetail,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  loading: false,
  error: null,
  sortField: "product_name",
  sortOrder: "asc",
  search: "",
  category: null,
  formData: {
    category_id: 0,
    product_name: "",
    description: "",
    price: 0,
    images: [],
  },
};
const access_token = Cookies.get("access_token");

export const fetchAllProductsAdmin = createAsyncThunk(
  "manageProduct/fetchAllProductsAdmin",
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
      pageSize: number;
      search?: string;
      category?: string;
      sortField?: string;
      sortOrder?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/super-admin/products?page=${page}&pageSize=${pageSize}&search=${search}&category=${category}&sortField=${sortField}&sortOrder=${sortOrder}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data.products;
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

export const createProduct = createAsyncThunk(
  "manageProduct/createProduct",
  async (
    {
      category_id,
      product_name,
      description,
      price,
      images,
    }: {
      category_id: number;
      product_name: string;
      description: string;
      price: number;
      images: File[];
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      if (category_id == null) {
        throw new Error("Category ID is required.");
      }
    
      if (price == null) {
        throw new Error("Price is required.");
      }
      formData.append("category_id", category_id.toString());
      formData.append("product_name", product_name);
      formData.append("description", description);
      formData.append("price", price.toString());

      images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await axios.post(`/api/products`, formData, {
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create product."
        );
      } else {
        return rejectWithValue("An Unexpected error occurred.");
      }
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  "manageProduct/fetchProductDetails",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/super-admin/products/details/${productId}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.product as ProductDetail;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch product details."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const updateProductField = createAsyncThunk(
  "manageProduct/updateProductField",
  async (
    {
      productId,
      field,
      value,
    }: { productId: number; field: string; value: string },
    { rejectWithValue }
  ) => {
    try {
      const endpoint = fieldEndpointMap[field];
      const response = await axios.patch(
        `/api/products/${endpoint}/${productId}`,
        { [field]: value },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || `Failed to update ${field}.`
        );
      } else {
        return rejectWithValue("An Unexpected error occurred.");
      }
    }
  }
);

export const updateProductImage = createAsyncThunk(
  "manageProduct/updateProductImage",
  async (
    { imageId, imageFile, index }: { imageId: number; imageFile: File; index: number },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await axios.patch(
        `/api/products/images/${imageId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(error.response.data.message || "Failed to update image.");
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);


const manageProductSlice = createSlice({
  name: "manageProduct",
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
    setFormData: (
      state,
      action: PayloadAction<{
        field: keyof ManageProductState["formData"];
        value: any;
      }>
    ) => {
      const { field, value } = action.payload;
      (state.formData[field] as WritableDraft<
        typeof state.formData
      >[keyof typeof state.formData]) = value;
    },

    resetFormData: (state) => {
      state.formData = {
        category_id: 0,
        product_name: "",
        description: "",
        price: 0,
        images: [],
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProductsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProductsAdmin.fulfilled, (state, action) => {
        state.products = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.loading = false;
      })
      .addCase(fetchAllProductsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload); // Assuming `products` is an array in the state
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload; // Assuming `productDetail` is added to the state
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductField.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductField.fulfilled, (state, action) => {
        state.loading = false;
        state.productDetail = action.payload
      })
      .addCase(updateProductField.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateProductImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductImage.fulfilled, (state, action) => {
        state.loading = false;
        const { index, updatedImage } = action.payload;
        state.productDetail.product_images = state.productDetail.product_images.map(
          (image, idx) => {
            if (idx === index) {
              return { ...image, product_image: updatedImage };
            }
            return image;
          }
        );
      })
      .addCase(updateProductImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setSortField,
  setCurrentPage,
  setSortOrder,
  setSearch,
  setCategory,
  setFormData,
  resetFormData
} = manageProductSlice.actions;

export default manageProductSlice.reducer;
