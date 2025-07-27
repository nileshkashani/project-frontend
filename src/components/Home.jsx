import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

function Home() {
  const [user, setUser] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const COUNTRY_API = "https://countriesnow.space/api/v0.1";

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (JSON.stringify(parsedUser) !== JSON.stringify(user)) {
        setUser(parsedUser);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    fetch(`${COUNTRY_API}/countries/states`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "India" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.states) setStates(data.data.states.map((s) => s.name));
      })
      .catch((err) => console.error("Failed to load states", err));
  }, []);

  const fetchCities = (stateName) => {
    fetch(`${COUNTRY_API}/countries/state/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: "India", state: stateName }),
    })
      .then((res) => res.json())
      .then((data) => setCities(data.data || []))
      .catch((err) => console.error("Failed to load cities", err));
  };

  const handleStateInput = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    setStateSuggestions(states.filter((s) => s.toLowerCase().startsWith(value.toLowerCase())));
    if (value.length > 2 && states.includes(value)) fetchCities(value);
  };

  const handleCityInput = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    setCitySuggestions(cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase())));
  };

  const selectState = (state) => {
    setSelectedState(state);
    setStateSuggestions([]);
    fetchCities(state);
  };

  const selectCity = (city) => {
    setSelectedCity(city);
    setCitySuggestions([]);
  };

  const handleSearchSuppliers = () => {
    if (selectedState && selectedCity) {
      localStorage.setItem("state", selectedState);
      localStorage.setItem("city", selectedCity);
      navigate(`/products?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-gray-50 to-indigo-100 font-inter">
      {/* Header */}
      <motion.header
        className="bg-white shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Logo + Title */}
        <div className="flex items-center space-x-2">
          <img src="/assets/logo1.png" className="w-14 h-14" alt="Logo" />
          <motion.h1 className="text-3xl md:text-4xl font-bold text-indigo-700" whileHover={{ scale: 1.1 }}>
            SnackSource
          </motion.h1>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-indigo-700 text-2xl">
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-indigo-700 font-medium">
          <Link to="/user-manual" className="hover:text-indigo-900">User Manual</Link>
          {user ? (
            <>
              {user.role === "VENDOR" && (
                <>
                  <Link to="/cart" className="hover:text-indigo-900">My Cart</Link>
                  <Link to="/orders" className="hover:text-indigo-900">My Orders</Link>
                </>
              )}
              {user.role === "SUPPLIER" && (
                <>
                  <Link to="/add-product" className="hover:text-indigo-900">Add Raw Material</Link>
                  <Link to="/my-products" className="hover:text-indigo-900">My Raw Materials</Link>
                </>
              )}
              <div className="flex justify-center items-center">
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="hover:text-indigo-900">Register</Link>
              <Link to="/login" className="hover:text-indigo-900">Login</Link>
            </>
          )}
        </nav>
      </motion.header>

      {/* Mobile Dropdown Nav */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4 text-indigo-700 font-medium">
          <Link to="/user-manual" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>User Manual</Link>
          {user ? (
            <>
              {user.role === "VENDOR" && (
                <>
                  <Link to="/cart" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>My Cart</Link>
                  <Link to="/orders" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>My Orders</Link>
                </>
              )}
              {user.role === "SUPPLIER" && (
                <>
                  <Link to="/add-product" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>Add Raw Material</Link>
                  <Link to="/my-products" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>My Raw Materials</Link>
                </>
              )}
              <div className="flex justify-center">
                <button
                  onClick={() => { handleLogout(); setMenuOpen(false); }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-40"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/register" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>Register</Link>
              <Link to="/login" className="block hover:text-indigo-900" onClick={() => setMenuOpen(false)}>Login</Link>
            </>
          )}
        </div>
      )}

      {/* Main Content */}
      <motion.main
        className={`px-6 text-center flex-grow flex flex-col ${
          !user ? "justify-center items-center" : "justify-start pt-20"
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <motion.h2
          className="text-5xl font-extrabold text-indigo-700 mb-6"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Empowering Street Food Vendors
        </motion.h2>

        <motion.p className="text-gray-700 text-lg mb-10">
          Connect with affordable suppliers. Explore raw materials, manage your cart, and order smoothly.
        </motion.p>

        {user?.role === "VENDOR" && (
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto mb-10"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4 text-indigo-600">Find Raw Materials Near You</h3>

            <div className="relative mb-4">
              <input
                type="text"
                value={selectedState}
                onChange={handleStateInput}
                placeholder="Type your State"
                className="border px-4 py-2 rounded-md w-full"
              />
              {stateSuggestions.length > 0 && (
                <ul className="absolute bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto z-10">
                  {stateSuggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => selectState(s)}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative mb-4">
              <input
                type="text"
                value={selectedCity}
                onChange={handleCityInput}
                placeholder="Type your City"
                className="border px-4 py-2 rounded-md w-full"
              />
              {citySuggestions.length > 0 && (
                <ul className="absolute bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto z-10">
                  {citySuggestions.map((c, i) => (
                    <li
                      key={i}
                      onClick={() => selectCity(c)}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer"
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              onClick={handleSearchSuppliers}
              className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700"
            >
              Search
            </button>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

export default Home;
