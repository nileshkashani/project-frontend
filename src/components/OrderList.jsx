import { useEffect, useState, useMemo } from "react";
import axios from "axios";

function OrderList() {
  // Parse user only once and memoize so it doesn't change every render
  const user = useMemo(() => JSON.parse(localStorage.getItem("user")), []);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`https://project-backend-production-d6c2.up.railway.app/orders/vendor/${user.id}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders", err));
    }
  }, [user]); // user reference is stable now

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 font-inter">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">My Orders</h2>
      <div className="grid gap-4 max-w-3xl mx-auto">
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          orders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
            >
              <p className="text-lg font-semibold text-gray-800">
                Product: <span className="text-blue-700">{o.product?.name}</span>
              </p>
              <p className="text-gray-700">Quantity: {o.quantity}</p>
              <p className="text-gray-700">Address: {o.deliveryAddress}</p>
              <p className="text-gray-700">Payment: {o.paymentMethod}</p>
              <p className="text-gray-700">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    o.status === "PLACED"
                      ? "text-orange-500"
                      : o.status === "ACCEPTED"
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  {o.status}
                </span>
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OrderList;
