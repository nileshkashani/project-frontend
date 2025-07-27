import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;
  const navigate = useNavigate();

  const checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  const total = checkoutItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const placeOrder = async () => {
    if (!deliveryAddress.trim()) {
      alert("Please enter a delivery address.");
      return;
    }

    if (checkoutItems.length === 0) {
      alert("No items selected for checkout.");
      return;
    }

    if (paymentMethod !== "COD") {
      alert(
        "Payment gateway is not yet integrated. Please select Cash on Delivery to complete your order."
      );
      return;
    }

    try {
      const productIds = checkoutItems.map((item) => item.product.id);

      const requestBody = {
        vendorId,
        productIds,
        deliveryAddress,
        paymentMethod,
      };

      await axios.post("http://localhost:8080/orders/checkout", requestBody, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.removeItem("checkoutItems");
      alert("Order placed successfully!");
      navigate("/orders"); // ✅ Redirect to /orders instead of /products
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-md shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      {checkoutItems.length === 0 ? (
        <p className="text-center text-gray-600">No items selected for checkout.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {checkoutItems.map((item) => (
              <li key={item.id} className="py-2 flex justify-between">
                <span>{item.product.name}</span>
                <span>₹{item.product.price} × {item.quantity}</span>
              </li>
            ))}
          </ul>

          <h3 className="text-lg font-semibold mb-4 text-right">
            Total Amount: ₹{total}
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Delivery Address:</label>
            <textarea
              rows={3}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter delivery address"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Select Payment Method:</label>
            <label className="flex items-center mb-1">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === "UPI"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              UPI / Online Payment
            </label>
            <p className="text-red-500 mt-2 text-sm">
              ⚠️ Payment gateway is not yet integrated. Please select{" "}
              <strong>Cash on Delivery</strong> to complete your order.
            </p>
          </div>

          <button
            onClick={placeOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded w-full"
          >
            Confirm & Pay
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
