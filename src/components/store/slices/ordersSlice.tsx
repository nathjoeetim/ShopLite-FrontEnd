import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface OrderItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  total: number;
}

interface OrdersState {
  list: Order[];
}

const initialState: OrdersState = {
  list: [],
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      state.list.push(action.payload);
      localStorage.setItem("orders", JSON.stringify(state.list)); // 👈 persist
    },
    loadOrders: state => {
      const saved = localStorage.getItem("orders");
      if (saved) {
        state.list = JSON.parse(saved);
      }
    },
  },
});

export const { addOrder, loadOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
