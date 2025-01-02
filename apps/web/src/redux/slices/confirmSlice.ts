import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfirmationState {
  isConfirmationOpen: boolean;
  confirmationMessage: string | null;
  onConfirm: (() => void) | null;
}

const initialState: ConfirmationState = {
  isConfirmationOpen: false,
  confirmationMessage: null,
  onConfirm: null,
};

const confirmationSlice = createSlice({
  name: "confirmation",
  initialState,
  reducers: {
    showConfirmation: (
      state,
      action: PayloadAction<{
        message: string;
        onConfirm: () => void;
      }>
    ) => {
      state.isConfirmationOpen = true;
      state.confirmationMessage = action.payload.message;
      state.onConfirm = action.payload.onConfirm;
    },
    hideConfirmation: (state) => {
      state.isConfirmationOpen = false;
      state.confirmationMessage = null;
      state.onConfirm = null;
    },
  },
});

export const { showConfirmation, hideConfirmation } = confirmationSlice.actions;
export default confirmationSlice.reducer;
