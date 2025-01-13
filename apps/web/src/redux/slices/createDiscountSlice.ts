import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axioss, { AxiosError, isAxiosError } from "axios";
import Cookies from "js-cookie";

interface CreateDiscountState {
  type: string;
  inventory_id: number | null;
  value: number | null;
  min_purchase: number | null;
  max_discount: number | null;
  bogo_product_id: number | null;
  description: string;
  start_date: string | null;
  end_date: string | null;
  image: File | null;
  loading: boolean;
  error: string | null;
}

const initialState: CreateDiscountState = {
  type: "",
  inventory_id: null,
  value: null,
  min_purchase: null,
  max_discount: null,
  bogo_product_id: null,
  description: "",
  start_date: null, // ISO formatted string
  end_date: null,
  image: null,
  loading: false,
  error: null,
};

const access_token = Cookies.get("access_token");
const storeId = Cookies.get("storeId");

export const createDiscount = createAsyncThunk(
  "createDiscount/createDiscount",
  async (
    {
      type,
      inventory_id,
      value,
      min_purchase,
      max_discount,
      bogo_product_id,
      description,
      start_date,
      end_date,
      image,
    }: {
      type: string;
      inventory_id: number | null;
      value: number | null;
      min_purchase: number | null;
      max_discount: number | null;
      bogo_product_id: number | null;
      description: string;
      start_date: string | null;
      end_date: string | null;
      image: File | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      // Validation
      if (!type) return rejectWithValue("Discount type is required.");
      if (type !== "BOGO" && type !== "PERCENTAGE" && type !== "NOMINAL")
        return rejectWithValue("Invalid discount type.");
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
      if (!start_date || !end_date)
        return rejectWithValue("Start date and end date are required.");
      if (type === "BOGO" && (!bogo_product_id || !inventory_id))
        return rejectWithValue(
          "BOGO discounts require both a product and a BOGO Product."
        );

      if (!description) return rejectWithValue("Description is required");

      // Append data to FormData
      formData.append("type", type);
      if (inventory_id !== null)
        formData.append("inventory_id", inventory_id.toString());
      if (value !== null) formData.append("value", value.toString());
      if (min_purchase !== null)
        formData.append("min_purchase", min_purchase.toString());
      if (max_discount !== null)
        formData.append("max_discount", max_discount.toString());
      if (bogo_product_id !== null)
        formData.append("bogo_product_id", bogo_product_id.toString());
      formData.append("description", description);
      formData.append("start_date", start_date);
      formData.append("end_date", end_date);
      if (image) formData.append("image", image);

      const response = await axios.post(
        `/api/store-admin/discounts/${storeId}`,
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
      if (axioss.isAxiosError(error)) {
        console.error("Error Object:", error.response);
        const errorMessage =
          error.response?.data?.detail || "Failed to create discount.";
        return rejectWithValue(errorMessage);
      } else if (error instanceof Error) {
        return rejectWithValue(
          error.message || "An unexpected error occurred."
        );
      } else {
        return rejectWithValue("An unexpected error occurred.");
      }
    }
  }
);

const createDiscountSlice = createSlice({
  name: "createDiscount",
  initialState,
  reducers: {
    setDiscountType: (state, action: PayloadAction<string>) => {
      state.type = action.payload;
    },
    setInventoryId: (state, action: PayloadAction<number | null>) => {
      state.inventory_id = action.payload;
    },
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload; // Add `value` field in the state
    },
    setMinPurchase: (state, action: PayloadAction<number>) => {
      state.min_purchase = action.payload;
    },
    setMaxDiscount: (state, action: PayloadAction<number>) => {
      state.max_discount = action.payload;
    },
    setBogoProductId: (state, action: PayloadAction<number | null>) => {
      state.bogo_product_id = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setStartDate: (state, action: PayloadAction<string | null>) => {
      state.start_date = action.payload;
    },
    setEndDate: (state, action: PayloadAction<string | null>) => {
      state.end_date = action.payload;
    },
    setImage: (state, action: PayloadAction<File | null>) => {
      state.image = action.payload; // Set the image file
    },
    resetMinMax: (state) => {
      state.min_purchase = null;
      state.max_discount = null;
    },
    resetBogo: (state) => {
      state.value = null;
      state.min_purchase = null;
      state.max_discount = null;
    },
    resetForm: (state) => {
      state.type = "";
      state.inventory_id = null;
      state.value = null;
      state.min_purchase = null;
      state.max_discount = null;
      state.bogo_product_id = null;
      state.description = "";
      state.start_date = null;
      state.end_date = null;
      state.image = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDiscount.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setDiscountType,
  setInventoryId,
  setValue,
  setMinPurchase,
  setMaxDiscount,
  setBogoProductId,
  setDescription,
  setStartDate,
  setEndDate,
  setImage,
  resetForm,
  resetMinMax,
  resetBogo,
} = createDiscountSlice.actions;

export default createDiscountSlice.reducer;
