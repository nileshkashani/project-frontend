import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import RegisterUser from "./components/RegisterUser";
import LoginUser from "./components/LoginUser";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import OrderList from "./components/OrderList";
import ProtectedRoute from "./components/ProtectedRoute";

import MyProducts from './components/MyProducts'; // ✅ Adjust path as per your structure

import UserManual from "./components/UserManual"; // Adjust path if needed




function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterUser />} />
        <Route path="/login" element={<LoginUser />} />

        {/* Protected Routes */}
        <Route
          path="/add-product"
          element={
            <ProtectedRoute>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route path="/products" element={<ProductList />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderList />
            </ProtectedRoute>
          }
        />
        <Route path="/my-products" element={<MyProducts />} />
        {/* Removed supplier-profile and vendor-profile routes since replaced with Home */}
        <Route path="/user-manual" element={<UserManual />} />
      </Routes>
    </Router>
  );
}

export default App;
