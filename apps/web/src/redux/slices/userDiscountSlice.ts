import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError, isAxiosError } from "axios";
import Cookies from "js-cookie";
import { UserDiscountState } from "@/utils/reduxInterface";

const initialState: UserDiscountState = {
  allUserDiscounts: [],
  loading: false,
  error: null,
};

const access_token = Cookies.get("access_token");

export const fetchDiscountsByStoreId = createAsyncThunk(
  "discounts/fetchDiscountsByStoreId",
  async (store_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/users/discounts/${store_id || 28}`,
        {
          headers: { Authorization: `Bearer ${access_token}` }, // Include the access token
        }
      );
      return response.data.data; // Ensure this aligns with the structure of your API response
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch discounts."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const userDiscountSlice = createSlice({
  name: "userDiscounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscountsByStoreId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscountsByStoreId.fulfilled, (state, action) => {
        state.loading = false;
        state.allUserDiscounts = action.payload; // Populate the data into the state
      })
      .addCase(fetchDiscountsByStoreId.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch discounts.";
      });
  },
});

export default userDiscountSlice.reducer;
