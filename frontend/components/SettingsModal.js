"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  X,
  Globe,
  Settings,
  KeyRound,
  Trash2,
} from "lucide-react";

export default function SettingsModal({
  isOpen,
  onClose,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [settings, setSettings] = useState({
    id: "",
    language: "English",
    auto_save: true,
    notifications: true,
    compact_mode: false,
    spell_check: true,
  });

  useEffect(() => {
    if (!isOpen) return;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setSettings({
        id: user.id,
        language: user.language || "English",
        auto_save: user.auto_save ?? true,
        notifications: user.notifications ?? true,
        compact_mode: user.compact_mode ?? false,
        spell_check: user.spell_check ?? true,
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
const handleDeleteAccount = async () => {
  try {
    await axios.delete(
      `http://localhost:5000/api/auth/delete-account/${settings.id}`
    );

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setShowDeleteConfirm(false);

    alert("Account deleted successfully.");

    window.location.href = "/";
  } catch (err) {
    console.error(err);
    alert("Failed to delete account.");
  }
};
  const handleSave = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/settings",
        settings
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Settings Updated!");
      onClose();
    } catch (err) {
      console.log(err);
      alert("Failed to update settings");
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
      <div className="fixed inset-0 flex justify-center items-center z-[101]">

        <div className="w-full max-w-[380px] rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl p-5 relative text-white">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-300 hover:text-white transition"
          >
            <X size={20} />
          </button>

          {/* Heading */}
          <h1 className="text-xl font-semibold mb-5">
            Settings
          </h1>

          {/* ========================= */}
          {/* PREFERENCES */}
          {/* ========================= */}

          <div className="mb-5">

            <div className="flex items-center gap-2 mb-3">
              <Settings size={18} />
              <h3 className="font-medium">
                Preferences
              </h3>
            </div>

            {[
              ["Auto Save Notes", "auto_save"],
              ["Notifications", "notifications"],
              ["Compact Mode", "compact_mode"],
              ["Spell Check", "spell_check"],
            ].map(([label, key]) => (

              <div
                key={key}
                className="flex justify-between items-center py-2"
              >
                <span className="text-sm">
                  {label}
                </span>

                <button
                  onClick={() => toggle(key)}
                  className={`w-10 h-6 rounded-full transition ${
                    settings[key]
                      ? "bg-indigo-500"
                      : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white mt-1 transition ${
                      settings[key]
                        ? "translate-x-5"
                        : "translate-x-1"
                    }`}
                  />
                </button>

              </div>

            ))}

          </div>

          {/* ========================= */}
          {/* ACCOUNT */}
          {/* ========================= */}

          <div>

            <div className="flex items-center gap-2 mb-3">
              <KeyRound size={18} />
              <h3 className="font-medium">
                Account
              </h3>
            </div>

            <button className="w-full text-left py-2 text-sm hover:text-indigo-400 transition">
              Change Password
            </button>

<button
  onClick={() => setShowDeleteConfirm(true)}
  className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300 transition flex items-center gap-2"
>
  <Trash2 size={16} />
  Delete Account
</button>

          </div>

          {/* Save */}

          <button
            onClick={handleSave}
            className="mt-5 w-full rounded-xl py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 font-medium hover:opacity-90 transition"
          >
            Save Changes
          </button>

        </div>

      </div>
      {showDeleteConfirm && (
  <>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[200]" />

    {/* Modal */}
    <div className="fixed inset-0 flex items-center justify-center z-[201] px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.45)] p-5">

        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-500/20 flex items-center justify-center mb-5">
          <Trash2 className="text-red-400" size={22} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-white">
          Delete Account
        </h2>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-300 leading-relaxed">
          This will permanently delete your account, notes, bookmarks,
          and all associated data.
        </p>

        <p className="mt-2 text-xs text-red-300">
          This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex justify-end gap-2">

          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="px-6 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleDeleteAccount}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-300"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  </>
)}
    </>
  );
}