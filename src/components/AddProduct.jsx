import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const savedName = localStorage.getItem('addProduct_name') || '';
  const savedDescription = localStorage.getItem('addProduct_description') || '';
  const savedPrice = localStorage.getItem('addProduct_price') || '';

  const [name, setName] = useState(savedName);
  const [description, setDescription] = useState(savedDescription);
  const [price, setPrice] = useState(savedPrice);

  useEffect(() => {
    localStorage.setItem('addProduct_name', name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem('addProduct_description', description);
  }, [description]);

  useEffect(() => {
    localStorage.setItem('addProduct_price', price);
  }, [price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "SUPPLIER") {
      alert("Only suppliers can add products.");
      return;
    }

    const productData = {
      name: name.trim(),
      description: description.trim(),
      price: parseFloat(price),
    };

    try {
      await axios.post(`https://project-backend-production-d6c2.up.railway.app/products/add/${user.id}`, productData, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: false,
      });

      alert("Product added successfully!");

      setName('');
      setDescription('');
      setPrice('');
      localStorage.removeItem('addProduct_name');
      localStorage.removeItem('addProduct_description');
      localStorage.removeItem('addProduct_price');
    } catch (error) {
      console.error("Error adding product", error);
      alert("Failed to add product. Please check console for details.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg mt-10 
                    sm:p-10 sm:mt-16
                    md:max-w-xl
                    lg:max-w-2xl font-inter">
      <h2 className="text-3xl font-bold text-indigo-600 mb-8 text-center">Add New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
        />
        <input
          type="text"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Product Price (₹)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-4 focus:ring-indigo-400 transition"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
