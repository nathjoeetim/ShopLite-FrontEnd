import { useSelector } from "react-redux";
import type { RootState } from "../components/store/store";

export default function OrdersPage() {
  const orders = useSelector((state: RootState) => state.orders.list);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        📦 My Orders
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-6 rounded-xl shadow-md border"
            >
              <div className="flex justify-between mb-4">
                <p className="text-gray-600">Order ID: {order.id}</p>
                <p className="text-gray-600">{order.date}</p>
              </div>
              <ul className="space-y-3">
                {order.items.map(item => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 rounded-lg border"
                      />
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-gray-600">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="text-right mt-4 font-bold text-lg">
                Total: ${order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
