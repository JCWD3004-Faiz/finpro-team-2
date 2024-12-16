import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorState {
  isErrorOpen: boolean;
  errorMessage: string | null;
}

const initialState: ErrorState = {
  isErrorOpen: false,
  errorMessage: null,
};

const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    showError: (state, action: PayloadAction<string>) => {
      state.isErrorOpen = true;
      state.errorMessage = action.payload;
    },
    hideError: (state) => {
      state.isErrorOpen = false;
      state.errorMessage = null;
    },
  },
});

export const {showError, hideError} = errorSlice.actions;
export default errorSlice.reducer;