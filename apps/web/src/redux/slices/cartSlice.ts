import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/utils/interceptor";
import axiosHandler from "axios"
import Cookies from "js-cookie";
import { UserVoucher } from '@/utils/userInterface';

interface CartVouchers {
  redeem_code: string;
  discount_amount: number;
  voucher_type: string;
  discount_type: string
}

interface CartState {
  cartItems: any[];
  cartPrice: number;
  loading: boolean;
  error: string | null;
  cartVouchers: CartVouchers[]
  orderId: number
  cartId: number
}

const initialState: CartState = {
  cartItems: [],
  cartPrice: 0,
  loading: false,
  error: null,
  cartVouchers: [],
  orderId: 0,
  cartId: 0,
};

const access_token = Cookies.get("access_token");

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (user_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/cart/items/${user_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.cart_data;
    } catch (err) {
      return rejectWithValue("Failed to retrieve cart items");
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async ({ user_id, cart_item_id }: { user_id: number, cart_item_id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/cart/${user_id}/${cart_item_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to remove cart item");
    }
  }
);

export const changeItemQuantity = createAsyncThunk(
  "cart/changeItemQuantity",
  async ({ user_id, cart_item_id, quantity }: { user_id: number, cart_item_id: number, quantity: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/cart/quantity`, {
        user_id,
        cart_item_id,
        quantity,
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to update item quantity");
    }
  }
);

export const fetchCartVouchers = createAsyncThunk<UserVoucher[], number,{ rejectValue: string }>(
  'cart/fetchCartVouchers',
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/cart/cart-vouchers/${user_id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.data.vouchers;
    } catch (error) {
      return rejectWithValue('Failed to fetch cart vouchers.');
    }
  }
);

export const checkoutCart = createAsyncThunk(
  "cart/checkoutCart",
  async (user_id: number, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/cart/checkout/${user_id}`, {}, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue("Failed to checkout cart");
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ user_id, inventory_id }: { user_id: number; inventory_id: number }, { rejectWithValue }) => {
    try {
      const response = await axiosHandler.post('/api/cart/add', {
        user_id,
        inventory_id
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      return response.data;
    } catch (err) {
      if (axiosHandler.isAxiosError(err) && err.response) {
        return rejectWithValue("This product is already in the cart");
      } else {
        return rejectWithValue("An unexpected error occurred");
      }
    }
  }
);

export const redeemProductVoucher = createAsyncThunk(
  "cart/redeemProductVoucher",
  async ({ user_id, user_voucher_id, cart_item_id }: { user_id: number, user_voucher_id: number, cart_item_id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/cart/redeem-product/`, {
        user_id,
        user_voucher_id,
        cart_item_id,
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to apply product voucher discount");
    }
  }
);

export const redeemCartVoucher = createAsyncThunk(
  "cart/redeemCartVoucher",
  async ({ user_id, user_voucher_id, cart_id }: { user_id: number, user_voucher_id: number, cart_id: number }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/cart/redeem-cart/`, {
        user_id,
        user_voucher_id,
        cart_id,
      }, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue("Failed to apply cart voucher discount");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload.cart_items;
        state.cartId = action.payload.cart_id
        state.cartPrice = action.payload.cart_price;
        state.loading = false;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeCartItem.pending, (state) => {
        state.loading = false;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = state.cartItems.filter(
          (item) => item.cart_item_id !== action.payload.cartItem.cart_item_id
        );
        state.cartPrice = action.payload.cartPrice.cart_price;
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeItemQuantity.pending, (state) => {
        state.loading = false;
      })
      .addCase(changeItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const updatedItem = action.payload.cartItem;
        state.cartItems = state.cartItems.map(item =>
          item.cart_item_id === updatedItem.cart_item_id
            ? { ...item, quantity: updatedItem.quantity, product_price: updatedItem.product_price} : item
        );
        state.cartPrice = action.payload.cartPrice.cart_price;
      })
      .addCase(changeItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCartVouchers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCartVouchers.fulfilled, (state, action) => { 
        state.loading = false; 
        state.cartVouchers = action.payload; 
      })
      .addCase(fetchCartVouchers.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload || 'Unknown error'; 
      })
      .addCase(checkoutCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.loading = false;
        state.orderId = action.payload.order.order_id
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = [...state.cartItems, action.payload.cart_item];
        state.cartPrice = action.payload.cart_price;
        state.cartVouchers = action.payload.cart_vouchers || state.cartVouchers;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(redeemProductVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(redeemProductVoucher.fulfilled, (state, action) => {
        state.loading = false;        
        const updatedItem = action.payload.cartItem;
        state.cartItems = state.cartItems.map(item =>
          item.cart_item_id === updatedItem.cart_item_id
            ? { ...item, quantity: updatedItem.quantity, product_price: updatedItem.product_price} : item
        );
        state.cartPrice = action.payload.cartPrice.cart_price
      })
      .addCase(redeemProductVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(redeemCartVoucher.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(redeemCartVoucher.fulfilled, (state, action) => {
        state.loading = false;
        state.cartPrice = action.payload.newCartPrice;
      })
      .addCase(redeemCartVoucher.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = cartSlice.actions;

export default cartSlice.reducer;
