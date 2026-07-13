"use client";
import axios from "axios";
import { useState } from "react";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToSignup,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
 const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: form.email,
        password: form.password,
      }
    );

    // Save JWT
    localStorage.setItem("token", res.data.token);

    // Save user
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    alert("Login Successful!");

    onClose();

    // Refresh navbar
    window.location.reload();

  } catch (err) {
  console.log(err.response?.data);
  console.log(err);

  setError(
    err.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101]">
        <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 relative">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-300 hover:text-white transition"
          >
            <X size={22} />
          </button>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome Back
          </h1>

          <p className="text-gray-300 mb-8">
            Login to continue using Memozi ✨
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-gray-400 hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot Password?
              </button>
            </div>
{error && (
  <p className="text-red-400 text-sm">
    {error}
  </p>
)}
            {/* Login */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Switch */}
          <p className="text-center text-gray-300 mt-8">
            Don't have an account?

            <button
              onClick={onSwitchToSignup}
              className="ml-2 text-indigo-400 hover:text-indigo-300 transition"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </>
  );
}