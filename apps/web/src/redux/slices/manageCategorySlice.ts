import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ManageCategoryState } from "@/utils/reduxInterface";
import axios from "@/utils/interceptor";
import axiosHandler, { AxiosError } from "axios";
import Cookies from "js-cookie";

const initialState: ManageCategoryState = {
  category: [],
  allCategory: [],
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  editId: null,
  loading: false,
  error: null,
  search: "",
};
const access_token = Cookies.get("access_token");

export const fetchCategories = createAsyncThunk(
  "manageCategory/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/products/categories/all`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch categories."
        );
      } else {
        return rejectWithValue("An Unexpected error occurred.");
      }
    }
  }
);

export const fetchAllCategories = createAsyncThunk(
  "manageCategory/fetchAllCategories",
  async (
    {
      page = 1,
      pageSize = 10,
      search = "",
    }: {
      page?: number;
      pageSize?: number;
      search?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/products/categories?page=${page}&pageSize=${pageSize}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch categories."
        );
      } else {
        return rejectWithValue("An Unexpected error occurred.");
      }
    }
  }
);

export const updateCategory = createAsyncThunk(
  "superAdmin/updateCategory",
  async (
    {
      category_id,
      category_name,
    }: { category_id: number; category_name: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosHandler.patch(
        `/api/products/categories/${category_id}`,
        { category_name },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to update the category."
        );
      } else {
        return rejectWithValue("Error updating category");
      }
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "manageCategory/deleteCategory",
  async ({ category_id }: { category_id: number }, { rejectWithValue }) => {
    try {
      const response = await axiosHandler.patch(
        `/api/products/categories/delete/${category_id}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to delete the category."
        );
      } else {
        return rejectWithValue("Error deleting the category");
      }
    }
  }
);

export const createCategory = createAsyncThunk(
  "manageCategory/createCategory",
  async ({ category_name }: { category_name: string }, { rejectWithValue }) => {
    try {
      const response = await axiosHandler.post(
        `/api/products/categories`,
        { category_name },
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to create a new category."
        );
      } else {
        return rejectWithValue("Error creating the new category");
      }
    }
  }
);

const manageCategorySlice = createSlice({
  name: "manageCategory",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
    setEditId: (state, action) => {
      state.editId = action.payload;
    },
    resetEditState: (state) => {
      state.editId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.category = action.payload.data;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
        state.loading = false;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCategory = state.category.find(
          (cat) => cat.category_id === action.payload.category_id
        );
        if (updatedCategory) {
          updatedCategory.category_name = action.payload.category_name;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.category = state.category.filter(
          (cat) => cat.category_id !== action.meta.arg.category_id
        );
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.category.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.allCategory = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSearch, setCurrentPage, setEditId, resetEditState } =
  manageCategorySlice.actions;
export default manageCategorySlice.reducer;
