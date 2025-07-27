import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?.id) {
      axios
        .get(`https://project-backend-production-d6c2.up.railway.app/products/by-supplier/${user.id}`)
        .then((res) => setProducts(res.data))
        .catch((err) => console.error("Failed to fetch products", err));
    }
  }, [user]);

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-indigo-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">My Raw Materials</h2>
      {products.length === 0 ? (
        <p className="text-center text-gray-600">No raw materials found.</p>
      ) : (
        <ul className="space-y-4">
          {products.map((prod) => (
            <motion.li
              key={prod.id}
              className="border p-4 rounded-lg shadow-lg flex justify-between bg-white transition-transform transform hover:scale-105"
              whileHover={{ scale: 1.02 }}
            >
              <div>
                <h3 className="font-bold text-lg text-indigo-600">{prod.name}</h3>
                <p className="text-gray-700">{prod.description}</p>
                <p className="text-gray-800 font-semibold">Price: ₹{prod.price}</p>
              </div>
              <div className="text-yellow-500 text-lg">⭐ {prod.rating || 0}</div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyProducts;
