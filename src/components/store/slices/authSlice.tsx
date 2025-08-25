import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: string | { email: string } | null;
  token: string | null;
  cart: CartItem[];
}

// Load from localStorage on app start
const storedUser = localStorage.getItem("userData");

const initialState: AuthState = storedUser
  ? JSON.parse(storedUser)
  : {
      isAuthenticated: false,
      user: null,
      token: null,
      cart: [],
    };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ email: string; token: string }>) => {
      state.isAuthenticated = true;
      state.user = { email: action.payload.email };
      state.token = action.payload.token;
      localStorage.setItem("userData", JSON.stringify(state)); // ✅ Save
    },
    logout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.cart = [];
      localStorage.removeItem("userData"); // ✅ Clear
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.cart.find(item => item.id === action.payload.id);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.cart.push(action.payload);
      }
      localStorage.setItem("userData", JSON.stringify(state)); // ✅ Save
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
      localStorage.setItem("userData", JSON.stringify(state)); // ✅ Save
    },
    clearCart: state => {
      state.cart = [];
      localStorage.setItem("userData", JSON.stringify(state)); // ✅ Save
    },
  },
});

export const { login, logout, addToCart, removeFromCart, clearCart } =
  authSlice.actions;

export default authSlice.reducer;

// // authSlice.ts
// import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";
// interface User {
//   email: string;
// }

// interface AuthState {
//   isAuthenticated: boolean;
//   user: User | null;
//   token: string | null;
// }

// const initialState: AuthState = {
//   isAuthenticated: false,
//   user: null,
//   token: null,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     login: (state, action: PayloadAction<{ email: string; token: string }>) => {
//       state.isAuthenticated = true;
//       state.user = { email: action.payload.email };
//       state.token = action.payload.token;
//     },
//     logout: state => {
//       state.isAuthenticated = false;
//       state.user = null;
//       state.token = null;
//     },
//   },
// });

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;
