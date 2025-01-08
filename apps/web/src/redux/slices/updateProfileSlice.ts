import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

interface updateProfileState {
    updateUsername: string;
    updateEmail: string;
    updateImage: File | null;
}

const initialState: updateProfileState = {
    updateUsername: "",
    updateEmail: "",
    updateImage: null,
}

const updateProfileSlice = createSlice({
    name: "updateProfile",
    initialState,
    reducers: {
      setUpdateUsername(state, action: PayloadAction<string>) {
        state.updateUsername = action.payload;
      },
      setUpdateEmail(state, action: PayloadAction<string>) {
        state.updateEmail = action.payload;
      },
      setUpdateImage(state, action: PayloadAction<File | null>) {
        state.updateImage = action.payload;
      },
      resetProfileState(state) {
        state.updateUsername = "";
        state.updateEmail = "";
        state.updateImage = null;
      },
    },
  });
  
  export const { setUpdateUsername, setUpdateEmail, setUpdateImage, resetProfileState } =
    updateProfileSlice.actions;
  export default updateProfileSlice.reducer;