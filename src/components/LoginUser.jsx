import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const BASE_URL = "https://project-backend-production-d6c2.up.railway.app";

  const loginWithPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, {
        email,
        password,
      });
      const user = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
      if (user.role === "VENDOR") {
        localStorage.setItem("vendorId", user.id);
      }
      navigate("/");
      window.location.reload(); // Refresh UI
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>

        <form onSubmit={loginWithPassword} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value.trim())}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}

export default LoginUser;
