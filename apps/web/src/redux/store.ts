import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import storeAdminReducer from './slices/storeAdminSlice';
import superAdminReducer from './slices/superAdminSlice';
import manageInventoryReducer from "./slices/manageInventorySlice";
import storeInventoryReducer from "./slices/storeInventorySlice";
import errorReducer from "./slices/errorSlice";
import successReducer from "./slices/successSlice";
import manageProductReducer from "./slices/manageProductSlice";
import manageCategoryReducer from "./slices/manageCategorySlice";
import superStockReducer from "./slices/superStockSlice";
import storeStockReducer from "./slices/storeStockSlice";
import confirmReducer from "./slices/confirmSlice"
import globalReducer from './slices/globalSlice';
import managePaymentReducer from "./slices/managePaymentSlice";
import manageVoucherReducer from "./slices/manageVoucherSlice";
import getDiscountsReducer from "./slices/getDiscountSlice";
import getProductsReducer from "./slices/getProductsSlice";
import getUserReducer from "./slices/getUserSlice";
import createDiscountReducer from "./slices/createDiscountSlice";
import updateDiscountReducer from "./slices/updateDiscountSlice";
import storeSalesReducer from "./slices/storeSalesSlice";
import superSalesReducer from "./slices/superSalesSlice";
import userProfileReducer from "./slices/userProfileSlice";
import userPaymentReducer from "./slices/userPaymentSlice";
import userDiscountReducer from "./slices/userDiscountSlice";
import landingReducer from "./slices/landingSlice";
import updateProfileReducer from "./slices/updateProfileSlice";
import checkoutReducer from "./slices/checkoutSlice"

const store = configureStore({
  reducer: {
    cart: cartReducer,
    superAdmin: superAdminReducer,
    storeAdmin: storeAdminReducer,
    manageInventory: manageInventoryReducer,
    storeInventory: storeInventoryReducer,
    manageProduct: manageProductReducer,
    manageCategory: manageCategoryReducer,
    managePayment: managePaymentReducer,
    manageVoucher: manageVoucherReducer,
    getDiscount: getDiscountsReducer,
    getProducts: getProductsReducer,
    getUsers: getUserReducer,
    createDiscount: createDiscountReducer,
    updateDiscount: updateDiscountReducer,
    storeSales: storeSalesReducer,
    storeStocks: storeStockReducer,
    superSales: superSalesReducer,
    superStock: superStockReducer,
    error: errorReducer,
    success: successReducer,
    confirm: confirmReducer,
    global: globalReducer,
    userProfile: userProfileReducer,
    userPayment: userPaymentReducer,
    userDiscounts: userDiscountReducer,
    landing: landingReducer,
    updateProfile: updateProfileReducer,
    checkout: checkoutReducer
  },
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch; 

export default store;
