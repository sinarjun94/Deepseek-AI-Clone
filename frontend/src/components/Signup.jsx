import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Toaster, toast } from "sonner";

function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const toastId = toast.loading("Creating your account...");

    try {
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/user/signup",
        formData
      );
      toast.success(data.message || "Signup successful!", { id: toastId });
      navigate("/login");
    } catch (error) {
      const msg =
        error?.response?.data?.errors || "Signup failed. Please try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors theme="dark" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 text-white w-full max-w-md rounded-2xl p-8 shadow-2xl transition-transform ">
          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-center mb-3">
            Join DeepSeek
          </h1>
          <p className="text-center text-gray-400 mb-6 text-sm">
            Create your free account to continue
          </p>

          {/* First Name */}
          <div className="mb-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] transition"
            />
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] transition"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] transition"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-white/10 border border-gray-600 rounded-lg px-4 py-3 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-400 text-center mb-6">
            By signing up, you agree to our{" "}
            <a href="#" className="underline text-[#7a6ff6]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline text-[#7a6ff6]">
              Privacy Policy
            </a>
            .
          </p>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition-transform active:scale-100 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Create Account"}
          </button>

          {/* Redirect Link */}
          <div className="text-center text-sm text-gray-400 mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#7a6ff6] font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
