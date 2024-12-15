import { configureStore } from '@reduxjs/toolkit';
import storeAdminReducer from './slices/storeAdminSlice';
import superAdminReducer from './slices/superAdminSlice';
import globalReducer from './slices/globalSlice';

const store = configureStore({
  reducer: {
    superAdmin: superAdminReducer,
    storeAdmin: storeAdminReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // RootState type
export type AppDispatch = typeof store.dispatch; // AppDispatch type for dispatching actions

export default store;
