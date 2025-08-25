import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchQuery: string;
  selectedCategory: string;
  maxPrice?: number;
  minPrice?: number;
  keyword: string;
}

const initialState: FilterState = {
  searchQuery: "",
  selectedCategory: "",
  maxPrice: undefined,
  minPrice: undefined,
  keyword: "",
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setSearchQuery: (state: FilterState, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (
      state: FilterState,
      action: PayloadAction<string>
    ) => {
      state.selectedCategory = action.payload;
    },
    setMaxPrice: (
      state: FilterState,
      action: PayloadAction<number | undefined>
    ) => {
      state.maxPrice = action.payload;
    },
    setMinPrice: (
      state: FilterState,
      action: PayloadAction<number | undefined>
    ) => {
      state.minPrice = action.payload;
    },
    setKeyword: (state: FilterState, action: PayloadAction<string>) => {
      state.keyword = action.payload;
    },
    resetFilter: () => initialState, // ✅ reset back to initial state
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setMaxPrice,
  setMinPrice,
  setKeyword,
  resetFilter, // export reset action
} = filterSlice.actions;

export default filterSlice.reducer;
