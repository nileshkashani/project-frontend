import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function Home() {
  const [user, setUser ] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const savedUser  = JSON.parse(localStorage.getItem("user"));
    if (savedUser ) setUser (savedUser );
  }, []);

  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
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
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
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
    setStateSuggestions(
      states.filter((s) => s.toLowerCase().startsWith(value.toLowerCase()))
    );
    if (value.length > 2 && states.includes(value)) fetchCities(value);
  };

  const handleCityInput = (e) => {
    const value = e.target.value;
    setSelectedCity(value);
    setCitySuggestions(
      cities.filter((c) => c.toLowerCase().startsWith(value.toLowerCase()))
    );
  };

  const selectState = (stateName) => {
    setSelectedState(stateName);
    setStateSuggestions([]);
    fetchCities(stateName);
  };

  const selectCity = (cityName) => {
    setSelectedCity(cityName);
    setCitySuggestions([]);
  };

  const handleSearchSuppliers = () => {
    if (selectedState && selectedCity) {
      localStorage.setItem("state", selectedState);
      localStorage.setItem("city", selectedCity);
      navigate(
        `/products?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 font-sans">
      <motion.header
        className="bg-white shadow-lg py-4 px-6 flex justify-between items-center sticky top-0 z-50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        <motion.h1
          className="text-4xl font-bold text-indigo-700"
          whileHover={{ scale: 1.1 }}
        >
          SnackSource
        </motion.h1>
        <nav className="space-x-6 text-indigo-700 font-medium">
          {user ? (
            <>
              {user.role === "VENDOR" && (
                <>
                  <Link className="transition transform hover:scale-105 hover:text-indigo-900 hover:font-semibold" to="/user-manual">User  Manual</Link>
                  <Link className="transition transform hover:scale-105 hover:text-indigo-900 hover:font-semibold" to="/cart">My Cart</Link>
                  <Link className="transition transform hover:scale-105 hover:text-indigo-900 hover:font-semibold" to="/orders">My Orders</Link>
                </>
              )}
              {user.role === "SUPPLIER" && (
                <>
                  <Link className="transition transform hover:scale-105 hover:text-indigo-900 hover:font-semibold" to="/add-product">Add Raw Material</Link>
                  <Link className="transition transform hover:scale-105 hover:text-indigo-900 hover:font-semibold" to="/my-products">My Raw Materials</Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
             
            </>
          )}
        </nav>
      </motion.header>

      <motion.main
        className="max-w-4xl mx-auto py-20 px-6 text-center"
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

        <motion.p
          className="text-gray-700 text-lg mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Connect with affordable suppliers. Explore raw materials, manage your cart, and order smoothly.
        </motion.p>

        {user?.role === "VENDOR" && (
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg max-w-2xl mx-auto mb-10"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold mb-4 text-indigo-600">Find Raw Materials Near You</h3>

            <motion.div className="relative mb-4">
              <input
                type="text"
                value={selectedState}
                onChange={handleStateInput}
                placeholder="Type your State"
                className="border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
              {stateSuggestions.length > 0 && (
                <motion.ul
                  className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {stateSuggestions.map((s, i) => (
                    <li
                      key={i}
                      onClick={() => selectState(s)}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer transition"
                    >
                      {s}
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.div>

            <motion.div className="relative mb-4">
              <input
                type="text"
                value={selectedCity}
                onChange={handleCityInput}
                placeholder="Type your City"
                className="border px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 transition"
              />
              {citySuggestions.length > 0 && (
                <motion.ul
                  className="absolute z-10 bg-white border w-full mt-1 rounded shadow max-h-40 overflow-y-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {citySuggestions.map((c, i) => (
                    <li
                      key={i}
                      onClick={() => selectCity(c)}
                      className="px-4 py-2 hover:bg-indigo-100 cursor-pointer transition"
                    >
                      {c}
                    </li>
                  ))}
                </motion.ul>
              )}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearchSuppliers}
              className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Search
            </motion.button>
          </motion.div>
        )}

        {!user && (
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/register"
              className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Register
            </Link>
            <Link
              to="/login"
              className="inline-block px-6 py-3 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-100 transition"
            >
              Login
            </Link>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}

export default Home;
