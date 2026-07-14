"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { X, Camera, User, Mail } from "lucide-react";

export default function ProfileModal({
  isOpen,
  onClose,
  setUser,
}) {
  const [localUser, setLocalUser] = useState({
    id: "",
    name: "",
    email: "",
    profile_picture: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const savedUser = JSON.parse(localStorage.getItem("user"));

    if (savedUser) {
      setLocalUser(savedUser);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setLocalUser({
      ...localUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setLocalUser((prev) => ({
        ...prev,
        profile_picture: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        {
          id: localUser.id,
          name: localUser.name,
          profile_picture: localUser.profile_picture,
        }
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // Update Navbar instantly
      setUser(res.data.user);

      alert("Profile Updated!");

      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[101]">

        <div className="w-full max-w-sm rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 relative">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute right-5 top-5 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>

          {/* Title */}
          <h1 className="text-xl font-semibold mb-5">
            My Profile
          </h1>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">

            <div className="relative">

              {localUser.profile_picture ? (
                <img
                  src={localUser.profile_picture}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                  {localUser.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}

              <label className="absolute bottom-0 right-0 bg-indigo-600 p-2 rounded-full cursor-pointer hover:bg-indigo-500 transition">

                <Camera size={16} className="text-white" />

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImage}
                />

              </label>

            </div>

            <p className="text-xs text-gray-300 mt-3">
              Change Profile Picture
            </p>

          </div>

          {/* Name */}
          <div className="relative mb-4">

            <User
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              type="text"
              name="name"
              value={localUser.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-indigo-500"
            />

          </div>

          {/* Email */}
          <div className="relative mb-6">

            <Mail
              size={18}
              className="absolute left-4 top-3.5 text-gray-400"
            />

            <input
              type="email"
              value={localUser.email}
              disabled
              className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 cursor-not-allowed"
            />

          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:opacity-90 transition"
          >
            Save Changes
          </button>

        </div>

      </div>
    </>
  );
}