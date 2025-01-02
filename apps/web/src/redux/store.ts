import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import storeAdminReducer from './slices/storeAdminSlice';
import superAdminReducer from './slices/superAdminSlice';
import manageInventoryReducer from "./slices/manageInventorySlice";
import errorReducer from "./slices/errorSlice";
import successReducer from "./slices/successSlice";
import globalReducer from './slices/globalSlice';

const store = configureStore({
  reducer: {
    cart: cartReducer,
    superAdmin: superAdminReducer,
    storeAdmin: storeAdminReducer,
    manageInventory: manageInventoryReducer,
    error: errorReducer,
    success: successReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 

export default store;
