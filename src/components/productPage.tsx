import axios from "axios";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  removeFromCart,
  selectItemCount,
  selectSubtotal,
} from "./store/slices/cartSlice";
import type { AppDispatch, RootState } from "./store/store";

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

export const ProductPage = () => {
  const itemCount = useSelector(selectItemCount);
  const subtotal = useSelector(selectSubtotal);
  const dispatch = useDispatch<AppDispatch>();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  // get cart items from redux
  const cartItems = useSelector((state: RootState) => state.cart.items);

  React.useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Product>(
          `https://dummyjson.com/products/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        <style>{`
          .loader {
            border-top-color: #6366f1;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg)} 
            100% { transform: rotate(360deg)} 
          }
        `}</style>
      </div>
    );
  }

  if (!product)
    return <div className="text-center p-8">Product not found.</div>;

  // check if product is already in cart
  const isInCart = cartItems.some(item => item.id === product.id);

  const handleCartAction = () => {
    if (!product) return;
    if (isInCart) {
      // remove if already in cart
      dispatch(removeFromCart(product.id));
    } else {
      // add to cart
      dispatch(
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          image: product.thumbnail,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white shadow-md">
        <span className=" sm:ml-7 font-extrabold text-[15px] ml-7 tracking-wide">
          {product.brand} ( {product.category} )
        </span>
        <Link
          to="/cart"
          className="flex items-center gap-3 bg-indigo-500 hover:bg-indigo-700 transition rounded-full px-4 py-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span className="hidden sm:inline">{itemCount} items</span>
          <span className="font-bold">${subtotal.toFixed(2)}</span>
        </Link>
      </header>

      {/* Back button */}
      <div className="max-w-6xl mx-auto px-6 mt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          aria-label="Go back to previous page"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Product details */}
      <main className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-xl shadow-lg">
        {/* Product Image */}
        <div className="rounded-lg overflow-hidden shadow-md">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            {product.title}
          </h1>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="flex flex-wrap gap-6 text-gray-800 text-lg font-medium mb-8">
            <div>
              Price:{" "}
              <span className="text-indigo-600 font-bold text-xl">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <div>⭐ {product.rating}</div>
            <div>Stock: {product.stock}</div>
            <div>Brand: {product.brand}</div>
            <div>Category: {product.category}</div>
          </div>

          <button
            disabled={product.stock === 0}
            onClick={handleCartAction}
            className={`self-start px-6 py-3 rounded-lg font-semibold text-white shadow-md transition-all duration-200 ${
              product.stock > 0
                ? isInCart
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            aria-disabled={product.stock === 0}
          >
            {product.stock === 0
              ? "Out of Stock"
              : isInCart
              ? "Remove from Cart"
              : "Add to Cart"}
          </button>
        </div>
      </main>
    </div>
  );
};
