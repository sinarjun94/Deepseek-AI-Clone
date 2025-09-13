import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useAuth } from "../context/AuthProvider";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [, setAuthUser] = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/user/login",
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }
      );

      toast.success(data.message || "Login succeeded!", { id: toastId });

      // Save user and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      setAuthUser(data.token);

      navigate("/"); // Redirect to home
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors ||
        "Login Failed. Please check your credentials.";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster theme="dark" position="top-right" richColors />
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-[#1e1e1e] text-white w-full max-w-md rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-gray-400 mb-8">
            Sign in to continue to DeepSeek
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 mb-1 block"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] focus:border-transparent"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 mb-1 block"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border border-gray-600 rounded-md px-4 py-3 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a6ff0] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-[#7a6ff6] hover:bg-[#6c61a6] text-white font-semibold py-3 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                "Login"
              )}
            </button>

            {/* Links */}
            <div className="text-center text-sm text-gray-400 mt-4">
              <p>
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#7a6ff6] font-medium hover:underline"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
