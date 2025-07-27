import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginUser() {
  const [method, setMethod] = useState(null); // null, "password", "otp"
  const [step, setStep] = useState(1); // for OTP flow: 1 = email input, 2 = OTP input

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const BASE_URL = "https://project-backend-production-d6c2.up.railway.app";

  // 🔒 Password-based login
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
      window.location.reload(); // 🔁 Force reload to update visible UI
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  // ✉️ Send OTP to user's email
  const sendOtp = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/users/send-otp`, { email });
      setStep(2);
      setError("");
    } catch (err) {
      setError("User not found or failed to send OTP");
    }
  };

  // 🔑 Verify entered OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/users/verify-otp`, {
        email,
        otp,
      });
      const user = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userRole", user.role);
      if (user.role === "VENDOR") {
        localStorage.setItem("vendorId", user.id);
      }
      navigate("/");
      window.location.reload(); // 🔁 Force reload after OTP login
    } catch (err) {
      setError("Invalid OTP");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>

        {/* 🔘 Method Selection */}
        {!method && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setMethod("password")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Login with Password
            </button>
            <button
              onClick={() => setMethod("otp")}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Login with OTP
            </button>
          </div>
        )}

        {/* 🔐 Password Login Form */}
        {method === "password" && (
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
            <button
              type="button"
              onClick={() => setMethod(null)}
              className="text-sm text-gray-500 underline block text-center"
            >
              ← Back to method selection
            </button>
          </form>
        )}

        {/* ✉️ OTP Login Flow */}
        {method === "otp" && (
          <form onSubmit={step === 1 ? sendOtp : verifyOtp} className="space-y-4">
            {step === 1 ? (
              <>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.trim())}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Verify & Login
                </button>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                setMethod(null);
                setStep(1);
                setEmail("");
                setOtp("");
                setError("");
              }}
              className="text-sm text-gray-500 underline block text-center"
            >
              ← Back to method selection
            </button>
          </form>
        )}

        {/* 🔴 Error Message */}
        {error && (
          <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
        )}
      </div>
    </div>
  );
}

export default LoginUser;
