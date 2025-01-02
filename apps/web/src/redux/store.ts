import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import storeAdminReducer from './slices/storeAdminSlice';
import superAdminReducer from './slices/superAdminSlice';
import manageInventoryReducer from "./slices/manageInventorySlice";
import errorReducer from "./slices/errorSlice";
import successReducer from "./slices/successSlice";
import manageProductReducer from "./slices/manageProductSlice";
import manageCategoryReducer from "./slices/manageCategorySlice";
import errorReducer from "./slices/errorSlice"
import successReducer from "./slices/successSlice"
import confirmReducer from "./slices/confirmSlice"
import globalReducer from './slices/globalSlice';
import managePaymentReducer from "./slices/managePaymentSlice";
import manageVoucherReducer from "./slices/manageVoucherSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    superAdmin: superAdminReducer,
    storeAdmin: storeAdminReducer,
    manageInventory: manageInventoryReducer,
    manageProduct: manageProductReducer,
    manageCategory: manageCategoryReducer,
    managePayment: managePaymentReducer,
    manageVoucher: manageVoucherReducer,
    error: errorReducer,
    success: successReducer,
    confirm: confirmReducer,
    global: globalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 

export default store;
