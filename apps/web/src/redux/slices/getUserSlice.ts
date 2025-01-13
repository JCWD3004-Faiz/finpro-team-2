import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError, isAxiosError } from "axios";
import { getAllUserState } from "@/utils/reduxInterface";
import Cookies from "js-cookie";

const access_token = Cookies.get("access_token");

const initialState: getAllUserState = {
  allUser: [],
  search: "",
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  role: "",
  loading: false,
  error: null,
};

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (
    {
      page = 1,
      pageSize = 10,
      search = "",
      role = "",
    }: {
      page?: number;
      pageSize?: number;
      search?: string;
      role?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/super-admin/users?page=${page}&pageSize=${pageSize}&search=${search}&role=${role}`,
        {
          headers: { Authorization: `Bearer ${access_token}` },
        }
      );
      return response.data.data; // Adjust to match your API response structure
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch users."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const getUserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.allUser = action.payload.data; // Replace `.users` with your API response structure
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(fetchAllUsers.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch users.";
      });
  },
});

export const {setCurrentPage} = getUserSlice.actions;

export default getUserSlice.reducer;
