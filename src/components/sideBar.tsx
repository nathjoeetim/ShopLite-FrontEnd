import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setKeyword,
  setMaxPrice,
  setMinPrice,
  setSearchQuery,
  setSelectedCategory,
  resetFilter,
} from "../components/store/slices/filterSlice";

import { logout } from "../components/store/slices/authSlice";
import { Outlet, useNavigate } from "react-router-dom";
import { LogOutIcon, Menu, X } from "lucide-react"; // ✅ for toggle icons

interface Product {
  category: string;
}

interface FetchResponse {
  products: Product[];
}

const SideBar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { keyword, maxPrice, minPrice, searchQuery, selectedCategory } =
    useSelector((state: any) => state.filter);

  const [categories, setCategories] = useState<string[]>([]);
  const [keywords] = useState<string[]>([
    "Apple",
    "Watch",
    "Fashion",
    "Trends",
    "Shoes",
    "Shirt",
  ]);

  // ✅ Sidebar toggle state
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://dummyjson.com/products");
        const data: FetchResponse = await response.json();

        const uniqueCategories = Array.from(
          new Set(data.products.map(p => p.category))
        );

        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setMinPrice(value ? parseFloat(value) : undefined));
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    dispatch(setMaxPrice(value ? parseFloat(value) : undefined));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category));
  };

  const handleKeywordClick = (word: string) => {
    dispatch(setKeyword(word));
  };

  const handleResetFilters = () => {
    dispatch(resetFilter());
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* 📱 Mobile Toggle Button */}
      <button
        className="absolute top-4 left-4 z-50 md:hidden bg-indigo-600 text-white p-2 rounded-lg shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={10} /> : <Menu size={10} />}
      </button>

      {/* 📂 Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-72 bg-white shadow-md border-r border-gray-200 overflow-y-scroll flex flex-col  p-2 transition-transform transform md:translate-x-0 z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:block`}
      >
        <div className=" flex items-center justify-between text-4xl font-extrabold mb-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-10 ">
          <h2 onClick={() => navigate("/")}>ShopLite</h2>
          <span>
            <LogOutIcon
              color="red"
              className="cursor-pointer"
              onClick={() => {
                dispatch(logout());
                navigate("/login"); // ✅ Force redirect
              }}
            />
          </span>
        </div>

        {/* 🔍 Search */}
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Search
          </label>
          <input
            type="search"
            placeholder="Search Product..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* 💲 Price Range */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Price Range
          </h2>
          <div className="flex space-x-3">
            <input
              type="number"
              min={0}
              placeholder="Min"
              value={minPrice ?? ""}
              onChange={handleMinPriceChange}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="number"
              min={0}
              placeholder="Max"
              value={maxPrice ?? ""}
              onChange={handleMaxPriceChange}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="mb-3 flex justify-start w-full">
          <div
            className="px-6 py-2 rounded-full text-sm font-semibold border flex items-center justify-center bg-gradient-to-r from-indigo-600 to-indigo-500 text-white border-indigo-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all w-full cursor-pointer"
            onClick={() => navigate("/orders")}
          >
            <span className="text-lg font-bold tracking-wide">
              🛍️ My Orders
            </span>
          </div>
        </div>

        {/* 📂 Categories */}
        <fieldset className="mb-85overflow-y-auto pr-1">
          <legend className="text-lg font-semibold mb-3 text-gray-800">
            📂 Categories
          </legend>
          <div className="space-y-2">
            {categories.map((category, index) => (
              <label
                key={index}
                className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 transition"
              >
                <input
                  type="radio"
                  name="category"
                  value={category}
                  checked={selectedCategory === category}
                  onChange={() => handleCategoryChange(category)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                />
                <span className="text-gray-700 text-sm">
                  {category.toUpperCase()}
                </span>
              </label>
            ))}

            {/* All Categories */}
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md px-2 py-1 transition mt-2">
              <input
                type="radio"
                name="category"
                value=""
                checked={selectedCategory === ""}
                onChange={() => dispatch(setSelectedCategory(""))}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-gray-500 italic text-sm">
                All Categories
              </span>
            </label>
          </div>
        </fieldset>

        {/* 🔑 Keywords */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            🔑 Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {keywords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleKeywordClick(word)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  keyword === word
                    ? "bg-indigo-600 text-white border-indigo-600 shadow"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {word}
              </button>
            ))}
            {keyword && (
              <button
                onClick={() => dispatch(setKeyword(""))}
                className="px-3 py-1.5 rounded-full text-sm font-medium border border-red-400 text-red-600 hover:bg-red-100 transition-all"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 🔄 Reset Button */}
        <button
          onClick={handleResetFilters}
          className="mt-auto py-3 w-full bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
        >
          🔄 Reset Filters
        </button>
      </aside>

      {/* 📄 Main Content */}
      <div className="flex-1 h-full bg-white overflow-y-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default SideBar;
