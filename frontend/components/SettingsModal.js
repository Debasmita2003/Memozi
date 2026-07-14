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

            <button className="w-full text-left py-2 text-sm text-red-400 hover:text-red-300 transition flex items-center gap-2">
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
    </>
  );
}