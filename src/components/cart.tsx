import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../components/store/store";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../components/store/slices/cartSlice";
import { addOrder } from "../components/store/slices/ordersSlice"; // 👈 import

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart.items);
  // const user = useSelector((state: RootState) => state.auth.user);

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const newOrder = {
      id: Date.now().toString(),
      date: new Date().toLocaleString(),
      items: cart,
      total: subtotal,
    };

    dispatch(addOrder(newOrder)); // save to Redux + localStorage
    dispatch(clearCart()); // clear cart
    navigate("/orders"); // redirect to orders page
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        🛒 Your Shopping Cart
      </h2>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl shadow-inner">
          <p className="text-xl text-gray-600 mb-6">Your cart is empty 😔</p>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Back to Shop
          </button>
        </div>
      ) : (
        <>
          {/* Items */}
          <ul className="space-y-6">
            {cart.map(item => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => navigate(`/product/${item.id}`)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-lg">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: Number(e.target.value),
                        })
                      )
                    }
                    className="w-16 border rounded-lg p-2 text-center"
                  />
                  <button
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Summary */}
          <div className="mt-8 bg-gray-50 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">
                Subtotal: ${subtotal.toFixed(2)}
              </h3>
              <button
                onClick={() => dispatch(clearCart())}
                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
              >
                Clear Cart
              </button>
            </div>

            <div className="text-right">
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
