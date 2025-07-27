import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [total, setTotal] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (vendorId) {
      axios
        .get(`https://project-backend-production-d6c2.up.railway.app/cart/view/${vendorId}`)
        .then((res) => {
          setCartItems(res.data);
        });
    }
  }, [vendorId]);

  useEffect(() => {
    let t = 0;
    selectedItems.forEach((itemId) => {
      const item = cartItems.find((i) => i.id === itemId);
      if (item) {
        t += item.quantity * item.product.price;
      }
    });
    setTotal(t);
  }, [selectedItems, cartItems]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const removeFromCart = (cartItemId) => {
    axios
      .delete(`https://project-backend-production-d6c2.up.railway.app/cart/remove/${cartItemId}`)
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        setSelectedItems((prev) => prev.filter((id) => id !== cartItemId));
      });
  };

  const checkout = () => {
    const selectedProducts = cartItems.filter((item) =>
      selectedItems.includes(item.id)
    );
    localStorage.setItem("checkoutItems", JSON.stringify(selectedProducts));
    navigate("/checkout");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-inter">
      <h2 className="text-3xl font-semibold mb-6 text-center text-blue-600">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">No items in cart.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  className="mt-1 accent-blue-600"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <div>
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">{item.product.description}</p>
                  <p className="text-gray-800 mt-1">
                    ₹{item.product.price} × {item.quantity} ={" "}
                    <span className="font-medium">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Supplier: {item.product.supplier?.name || "Unknown"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right">
            <h3 className="text-xl font-bold text-gray-700">
              Total (Selected): ₹{total}
            </h3>
            <button
              onClick={checkout}
              disabled={selectedItems.length === 0}
              className={`mt-4 px-6 py-2 rounded-md text-white ${
                selectedItems.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
