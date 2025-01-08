import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { DiscountDetail } from "@/utils/reduxInterface";

const access_token = Cookies.get("access_token");

const initialDiscountDetail: DiscountDetail = {
  discount_id: 0,
  inventory_id: 0,
  inventory_name: "",
  type: "",
  value: 0,
  min_purchase: 0,
  max_discount: 0,
  bogo_product_id: 0,
  bogo_product_name: "",
  description: "",
  is_active: false,
  image: "",
  start_date: new Date().toISOString(),
  end_date: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
};

interface UpdateDiscountState {
  discountDetail: DiscountDetail;
  loading: boolean;
  error: string | null;
  selectedImage: File | null;
}

const initialState: UpdateDiscountState = {
  discountDetail: initialDiscountDetail,
  loading: false,
  error: null,
  selectedImage: null
};

export const toggleIsActive = createAsyncThunk(
  "updateDiscount/toggleIsActive",
  async (
    { discount_id, currentStatus }: { discount_id: number; currentStatus: boolean },
    { rejectWithValue }
  ) => {
    try {
      const updatedStatus = !currentStatus; 
      const response = await axios.patch(
        `/api/store-admin/discounts/value/${discount_id}`,
        { is_active: updatedStatus },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data; // Assuming API returns the updated object
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to toggle active status."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);


export const saveUpdatedValue = createAsyncThunk(
  "updateDiscount/saveUpdatedValue",
  async (
    {
      discount_id,
      value,
      type,
    }: { discount_id: number; value: number | null; type: string },
    { rejectWithValue }
  ) => {
    try {
      if (value === null || value <= 0) {
        throw new Error("Value must be a positive number.");
      }
      if (
        (type === "PERCENTAGE" &&
          (value === null || value < 1 || value > 100)) ||
        (type === "NOMINAL" && (value === null || value <= 0))
      ) {
        return rejectWithValue(
          type === "PERCENTAGE"
            ? "For percentage discounts, the value must be between 1 and 100."
            : "For nominal discounts, the value must be greater than 0."
        );
      }
      const response = await axios.patch(
        `/api/store-admin/discounts/value/${discount_id}`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to update discount value."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const saveUpdatedStartDate = createAsyncThunk(
  "updateDiscount/saveUpdatedStartDate",
  async (
    {
      discount_id,
      date,
      field,
    }: { discount_id: number; date: string | null; field: "start_date" | "end_date"  },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch(
        `/api/store-admin/discounts/start/${discount_id}`,
        { [field]: date },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response?.data?.detail ||
            "Failed to update discount start date."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const saveUpdatedImage = createAsyncThunk(
  "updateDiscount/saveUpdatedImage",
  async (
    { discount_id, image }: { discount_id: number; image: File },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await axios.patch(
        `/api/store-admin/discounts/image/${discount_id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to update discount image."
        );
      } else if (error instanceof Error) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

export const fetchDiscountDetails = createAsyncThunk(
  "discounts/fetchDiscountDetails",
  async (discountId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `/api/store-admin/discounts/details/${discountId}`
      );
      return response.data.discount as DiscountDetail;
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch discount details."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const updateDiscountSlice = createSlice({
  name: "updateDiscount",
  initialState,
  reducers: {
    setDiscountValue: (state, action: PayloadAction<number | null>) => {
      state.discountDetail.value = action.payload;
    },
    setDiscountStartDate: (state, action: PayloadAction<string>) => {
      state.discountDetail.start_date = action.payload;
    },
    setDiscountEndDate: (state, action: PayloadAction<string>) => {
      state.discountDetail.end_date = action.payload;
    },
    setDiscountImage: (state, action: PayloadAction<File | null>) => {
      state.selectedImage = action.payload;
    },
    clearDiscountImage: (state) => {
      state.selectedImage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUpdatedValue.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUpdatedValue.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(saveUpdatedValue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleIsActive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleIsActive.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleIsActive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveUpdatedStartDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUpdatedStartDate.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.discountDetail.start_date = action.payload.start_date;
      })
      .addCase(saveUpdatedStartDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveUpdatedImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveUpdatedImage.fulfilled, (state, action) => {
        state.loading = false;
        state.discountDetail.image = action.payload.image; // Assuming API returns the updated image
      })
      .addCase(saveUpdatedImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchDiscountDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDiscountDetails.fulfilled,
        (state, action: PayloadAction<DiscountDetail>) => {
          state.discountDetail = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        fetchDiscountDetails.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setDiscountValue, setDiscountStartDate, setDiscountEndDate, setDiscountImage, clearDiscountImage } =
  updateDiscountSlice.actions;

export default updateDiscountSlice.reducer;
