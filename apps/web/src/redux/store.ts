import { configureStore } from '@reduxjs/toolkit';
import storeAdminReducer from './slices/storeAdminSlice';
import superAdminReducer from './slices/superAdminSlice';
import manageInventoryReducer from "./slices/manageInventorySlice";
import errorReducer from "./slices/errorSlice"
import successReducer from "./slices/successSlice"
import globalReducer from './slices/globalSlice';
import managePaymentReducer from "./slices/managePaymentSlice";


const store = configureStore({
  reducer: {
    superAdmin: superAdminReducer,
    storeAdmin: storeAdminReducer,
    manageInventory: manageInventoryReducer,
    managePayment: managePaymentReducer,
    error: errorReducer,
    success: successReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; // RootState type
export type AppDispatch = typeof store.dispatch; // AppDispatch type for dispatching actions

export default store;
