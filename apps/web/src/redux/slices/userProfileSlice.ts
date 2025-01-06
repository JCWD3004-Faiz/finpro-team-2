import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '@/utils/interceptor';
import Cookies from 'js-cookie';

// Define the initial state of the user profile
interface UserProfileState {
  username: string;
  email: string | null;
  image: string | null;
  loading: boolean;
  error: string | null;
}

// Define the initial state for the slice
const initialState: UserProfileState = {
  username: '',
  email: null,
  image: null,
  loading: true,
  error: null,
};

const access_token = Cookies.get('access_token');

// Create an async thunk to fetch the user profile
export const fetchProfile = createAsyncThunk(
  'userProfile/fetchProfile',
  async (user_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/profile/user/${user_id}`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      return response.data.data; // Return the profile data
    } catch (error) {
      return rejectWithValue('Error fetching profile');
    }
  }
);

// Create the slice
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.username = action.payload.username;
        state.email = action.payload.email;
        state.image = action.payload.image;
        state.loading = false;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default userProfileSlice.reducer;
