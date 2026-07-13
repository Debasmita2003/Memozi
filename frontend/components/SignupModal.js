"use client";
import axios from "axios";
import { useState } from "react";
import { X, Eye, EyeOff, User, Mail, Lock } from "lucide-react";

export default function SignupModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [success, setSuccess] = useState("");

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
  setSuccess("");

  if (
    !form.name ||
    !form.email ||
    !form.password ||
    !form.confirmPassword
  ) {
    setError("Please fill all fields.");
    return;
  }

  if (form.password !== form.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);

    const res = await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        name: form.name,
        email: form.email,
        password: form.password,
      }
    );

    setSuccess(res.data.message);

    setForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      onSwitchToLogin();
    }, 1500);

  } catch (err) {

    if (err.response) {
      setError(err.response.data.message);
    } else {
      setError("Server error.");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <>
      {/* Background */}

      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
        onClick={onClose}
      />

      {/* Modal */}

      <div className="fixed inset-0 flex items-center justify-center z-[101]">

        <div className="w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-8 relative">

          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-300 hover:text-white"
          >
            <X size={22} />
          </button>

          <h1 className="text-3xl font-bold text-white mb-2">
            Create Account
          </h1>

          <p className="text-gray-300 mb-8">
            Welcome to Memozi ✨
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}

            <div className="relative">

              <User
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
              />

            </div>

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
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
                className="absolute right-4 top-4 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>

            {/* Confirm */}

            <div className="relative">

              <Lock
                size={18}
                className="absolute left-4 top-4 text-gray-400"
              />

              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirm(!showConfirm)
                }
                className="absolute right-4 top-4 text-gray-400"
              >
                {showConfirm ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>

            </div>
{error && (
  <p className="text-red-400 text-sm">
    {error}
  </p>
)}

{success && (
  <p className="text-green-400 text-sm">
    {success}
  </p>
)}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>

          <p className="text-center text-gray-300 mt-8">

            Already have an account?

            <button
              onClick={onSwitchToLogin}
              className="ml-2 text-indigo-400 hover:text-indigo-300"
            >
              Login
            </button>

          </p>

        </div>

      </div>
    </>
  );
}