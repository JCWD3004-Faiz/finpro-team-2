import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import storeAdminReducer from './slices/storeAdminSlice';
import superAdminReducer from './slices/superAdminSlice';
import manageInventoryReducer from "./slices/manageInventorySlice";
import errorReducer from "./slices/errorSlice";
import successReducer from "./slices/successSlice";
import manageProductReducer from "./slices/manageProductSlice";
import manageCategoryReducer from "./slices/manageCategorySlice";
import superStockReducer from "./slices/superStockSlice";
import confirmReducer from "./slices/confirmSlice"
import globalReducer from './slices/globalSlice';
import managePaymentReducer from "./slices/managePaymentSlice";
import manageVoucherReducer from "./slices/manageVoucherSlice";
import getDiscountsReducer from "./slices/getDiscountSlice";
import createDiscountReducer from "./slices/createDiscountSlice";
import updateDiscountReducer from "./slices/updateDiscountSlice";
import superSalesReducer from "./slices/superSalesSlice";
import userProfileReducer from "./slices/userProfileSlice";
import userPaymentReducer from "./slices/userPaymentSlice";

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
    getDiscount: getDiscountsReducer,
    createDiscount: createDiscountReducer,
    updateDiscount: updateDiscountReducer,
    superSales: superSalesReducer,
    superStock: superStockReducer,
    error: errorReducer,
    success: successReducer,
    confirm: confirmReducer,
    global: globalReducer,
    userProfile: userProfileReducer,
    userPayment: userPaymentReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 

export default store;
