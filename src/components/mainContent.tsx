import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../components/store/store"; // <-- adjust path
import { Tally3 } from "lucide-react";
import axios from "axios";
import BookCard from "../BookedCard";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

function MainContent() {
  const { keyword, maxPrice, minPrice, searchQuery, selectedCategory } =
    useSelector((state: RootState) => state.filter);

  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [dropDownMenu, setDropDownMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const itemPerPage = 10;
  const totalPages = Math.ceil(totalProducts / itemPerPage);

  let startpage = Math.max(1, currentPage - 2);
  let endpage = Math.min(5, Math.min(totalPages, currentPage + 2));

  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedCategory]);

  useEffect(() => {
    let url = `https://dummyjson.com/products?limit=${itemPerPage}&skip=${
      (currentPage - 1) * itemPerPage
    }`;

    if (keyword) {
      url = `https://dummyjson.com/products/search?q=${keyword}`;
    }

    setLoading(true);
    setError(null);

    axios
      .get(url)
      .then(response => {
        let fetchedProducts: Product[] = response.data.products;
        setTotalProducts(response.data.total || fetchedProducts.length);

        if (minPrice !== undefined) {
          fetchedProducts = fetchedProducts.filter(p => p.price >= minPrice);
        }
        if (maxPrice !== undefined) {
          fetchedProducts = fetchedProducts.filter(p => p.price <= maxPrice);
        }
        if (searchQuery) {
          fetchedProducts = fetchedProducts.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (selectedCategory) {
          fetchedProducts = fetchedProducts.filter(
            p => p.category === selectedCategory
          );
        }

        if (filter === "Cheap") {
          fetchedProducts.sort((a, b) => a.price - b.price);
        } else if (filter === "Expensive") {
          fetchedProducts.sort((a, b) => b.price - a.price);
        } else if (filter === "Popular") {
          fetchedProducts.sort((a, b) => b.rating - a.rating);
        }

        setProducts(fetchedProducts);
        setLoading(false);
      })
      .catch(err => {
        setError("⚠️ Could not fetch products. Please try again later.");
        setLoading(false);
        console.error("Error fetching products:", err);
      });
  }, [
    currentPage,
    keyword,
    minPrice,
    maxPrice,
    searchQuery,
    selectedCategory,
    filter,
  ]);

  const handlePrevPage = () => {
    setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
  };

  const getPaginationButtons = () => {
    const buttons: number[] = [];
    if (currentPage - 2 < 1) {
      endpage = Math.min(totalPages, endpage + (2 - (currentPage - 1)));
    }
    if (currentPage + 2 > totalPages) {
      startpage = Math.max(1, startpage - (currentPage + 2 - totalPages));
    }
    for (let page = startpage; page <= endpage; page++) {
      buttons.push(page);
    }
    return buttons;
  };

  return (
    <section
      ref={contentRef}
      className="w-full max-w-7xl p-6 mx-auto rounded-lg shadow-sm"
    >
      <div className="mb-6">
        {/* Filter Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="relative mb-5 sm:mb-0">
            <button
              onClick={() => setDropDownMenu(!dropDownMenu)}
              className="sm:ml-7 border px-5 py-2 rounded-full flex items-center shadow-sm hover:shadow-md transition bg-white"
            >
              <Tally3 className="mr-2 text-indigo-500" />
              {filter === "all"
                ? "Filter"
                : filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
            {dropDownMenu && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-10 animate-fadeIn">
                {["All", "Cheap", "Expensive", "Popular"].map(option => (
                  <button
                    key={option}
                    className="block w-full text-left px-4 py-2 hover:bg-indigo-100 rounded-md"
                    onClick={() => {
                      setFilter(option === "All" ? "all" : option);
                      setDropDownMenu(false);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="w-full h-48 bg-gray-200 animate-pulse rounded-lg"
              ></div>
            ))}
          </div>
        )}
        {error && (
          <div className="text-center text-red-600 font-semibold py-10">
            {error}
          </div>
        )}

        {/* Products grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {products.map(product => (
              <BookCard
                key={product.id}
                id={product.id}
                images={product.images}
                price={product.price}
                title={product.title}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex flex-wrap justify-center items-center gap-2">
              {getPaginationButtons().map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full shadow-sm transition ${
                    page === currentPage
                      ? "bg-indigo-500 text-white"
                      : "bg-white border hover:bg-indigo-100"
                  }`}
                >
                  {page}
                </button>
              ))}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border shadow-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default MainContent;
