import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SuccessState {
  isSuccessOpen: boolean;
  successMessage: string | null;
}

const initialState: SuccessState = {
  isSuccessOpen: false,
  successMessage: null,
};

const successSlice = createSlice({
  name: "success",
  initialState,
  reducers: {
    showSuccess: (state, action: PayloadAction<string>) => {
      state.isSuccessOpen = true;
      state.successMessage = action.payload;
    },
    hideSuccess: (state) => {
      state.isSuccessOpen = false;
      state.successMessage = null;
    },
  },
});

export const { showSuccess, hideSuccess } = successSlice.actions;
export default successSlice.reducer;
