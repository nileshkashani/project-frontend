import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const indianStates = [/* your list here */];
const sampleCities = [/* your list here */];

function RegisterUser() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "VENDOR",
    city: "",
    state: "",
    address: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value.trimStart() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check supplier-specific required fields
    if (
      user.role === "SUPPLIER" &&
      (!user.city.trim() || !user.state.trim() || !user.address.trim())
    ) {
      alert("Please fill in City, State, and Address for Supplier registration.");
      return;
    }

    try {
      const response = await axios.post(
        "https://project-backend-production-d6c2.up.railway.app/users/register",
        user
      );
      const registeredUser = response.data;

      localStorage.setItem("user", JSON.stringify(registeredUser));
      localStorage.setItem("userRole", registeredUser.role);

      if (registeredUser.role === "VENDOR") {
        localStorage.setItem("vendorId", registeredUser.id);
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error registering user: " + (err.response?.data || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 font-inter">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

        {/* Name, Email, Password */}
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            name="name"
            value={user.name}
            placeholder="Name"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={user.email}
            placeholder="Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            value={user.password}
            placeholder="Password"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700">Role</label>
          <select
            name="role"
            onChange={handleChange}
            value={user.role}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="VENDOR">Vendor</option>
            <option value="SUPPLIER">Supplier</option>
          </select>
        </div>

        {/* Supplier-specific fields */}
        {user.role === "SUPPLIER" && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">State</label>
              <input
                name="state"
                placeholder="State"
                list="state-options"
                value={user.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <datalist id="state-options">
                {indianStates.map((state) => (
                  <option key={state} value={state} />
                ))}
              </datalist>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                name="city"
                placeholder="City"
                list="city-options"
                value={user.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md"
              />
              <datalist id="city-options">
                {sampleCities.map((city) => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700">Address</label>
              <textarea
                name="address"
                placeholder="Full address"
                value={user.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md resize-none"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterUser;
