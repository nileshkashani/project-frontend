import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [showCartLink, setShowCartLink] = useState(false); // NEW

  const user = JSON.parse(localStorage.getItem("user"));
  const vendorId = user?.id;

  const selectedCity = localStorage.getItem("city");
  const selectedState = localStorage.getItem("state");

  useEffect(() => {
    if (!selectedCity || !selectedState) {
      console.warn("City/state not set in localStorage");
      return;
    }

    fetchProducts();
    // eslint-disable-next-line
  }, [filter]);

  const fetchProducts = async () => {
    try {
      let url = `http://localhost:8080/products/by-location?state=${selectedState}&city=${selectedCity}`;

      if (filter === "price") url += "&sort=price";
      else if (filter === "rating") url += "&sort=rating";

      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const handleSearchChange = async (e) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

    if (!keyword.trim()) return fetchProducts();

    try {
      const res = await axios.get(
        `http://localhost:8080/products/search?keyword=${keyword}`
      );
      const filtered = res.data.filter(
        (p) =>
          p.supplier?.address?.city?.toLowerCase() ===
            selectedCity?.toLowerCase() &&
          p.supplier?.address?.state?.toLowerCase() ===
            selectedState?.toLowerCase()
      );
      setProducts(filtered);
    } catch (err) {
      console.error("Error searching products:", err);
    }
  };

  const handleFilterChange = (e) => setFilter(e.target.value);

  const handleAddToCart = async (productId) => {
    try {
      const quantity = 1;
      await axios.post("http://localhost:8080/cart/add", null, {
        params: { vendorId, productId, quantity },
      });
      setMessage("Item added to cart ✅");
      setShowCartLink(true); // NEW
    } catch (error) {
      console.error("Error adding item to cart:", error);
      setMessage("Error adding item to cart ❌");
    }
    setTimeout(() => {
      setMessage("");
      setShowCartLink(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
          Available Products
        </h2>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by name or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-2/3 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <select
            onChange={handleFilterChange}
            value={filter}
            className="w-full sm:w-1/3 px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Default</option>
            <option value="price">Price: Low to High</option>
            <option value="rating">Rating: High to Low</option>
          </select>
        </div>

        {message && (
          <div
            className={`text-center mb-4 text-lg font-medium ${
              message.includes("Error") ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}

        {showCartLink && (
          <div className="text-center mb-4">
            <Link
              to="/cart"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-green-700"
            >
              🛒 Go to My Cart
            </Link>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            ❌ No products available for your location.
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div
                key={p.id}
                className="bg-white p-4 rounded-xl shadow-md border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {p.name}
                </h3>
                <p className="text-gray-700 mb-1">💰 Price: ₹{p.price}</p>
                <p className="text-gray-700 mb-1">
                  🏢 Supplier: {p.supplier?.name || "Unknown"}
                </p>
                <p className="text-yellow-500 mb-1">
                  ⭐ Rating: {p.rating || 0}
                </p>
                <p className="text-gray-600 mb-3">
                  📦 Ordered by: {p.ordersCount || 0}{" "}
                  {p.ordersCount === 1 ? "person" : "people"}
                </p>
                <button
                  onClick={() => handleAddToCart(p.id)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl w-full transition-colors duration-200"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductList;
