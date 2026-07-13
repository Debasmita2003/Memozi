"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, X } from "lucide-react";
import { useSearch } from "@/context/SearchContext";
import LanguageToggle from "./LanguageToggle";
import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { query, setQuery } = useSearch(); // ✅ MOVED INSIDE COMPONENT
  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  const linkStyle = (path) =>
    pathname === path
      ? "text-white"
      : "text-gray-400 hover:text-white transition";
  const [user, setUser] = useState(null);
useEffect(() => {
  const savedUser = localStorage.getItem("user");

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
}, []);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);
  setProfileOpen(false);

  router.refresh();      // refresh navbar
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  setUser(null);
  setProfileOpen(false);

  window.location.reload();
};};

  return (<>
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50
      w-[92%] max-w-7xl
      backdrop-blur-2xl bg-neutral-900/60
      border border-white/10
      rounded-2xl
      shadow-[0_10px_40px_rgba(79,70,229,0.15)]
      transition-all duration-300">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <Link href="/">
          <span className="text-xl font-semibold tracking-tight 
            bg-gradient-to-r from-indigo-400 to-purple-400 
            bg-clip-text text-transparent cursor-pointer">
            Memozi
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <Link href="/notes" className={linkStyle("/notes")}>
            Notes
          </Link>
          <Link href="/bookmarks" className={linkStyle("/bookmarks")}>
            Bookmarks
          </Link>
        </div>

        <div className="flex items-center gap-4">
  <LanguageToggle />
</div>

        <div className="flex items-center space-x-5">

          {/* 🔎 Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              <Search size={20} />
            </button>

            {searchOpen && (
              <div className="absolute right-0 mt-3 w-64 
                backdrop-blur-xl bg-white/10 border border-white/20 
                rounded-xl shadow-xl p-3">
                <div className="flex items-center bg-white/10 rounded-lg px-3 py-2">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={query}                         // ✅ connected
                    onChange={(e) => setQuery(e.target.value)} // ✅ connected
                    className="bg-transparent outline-none text-sm w-full text-white"
                  />
                  <X
                    size={16}
                    className="text-gray-400 cursor-pointer"
                    onClick={() => {
                      setQuery("");
                      setSearchOpen(false);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          

          
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative text-gray-400 hover:text-white transition"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 
                bg-indigo-500 rounded-full"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-64 
                backdrop-blur-xl bg-white/10 border border-white/20 
                rounded-xl shadow-xl p-4 text-sm text-white">
                <p className="font-medium mb-2">Notifications</p>
                <p className="text-gray-300">
                  No new notifications 🎉
                </p>
              </div>
            )}
          </div>

          {user ? (
  <div className="relative" ref={profileRef}>
    <button
      onClick={() => setProfileOpen(!profileOpen)}
      className="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold"
    >
      {user.name[0].toUpperCase()}
    </button>

    {profileOpen && (
      <div className="absolute right-0 mt-3 w-56 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl shadow-indigo-500/10 py-2 text-sm text-white">

        <div className="px-4 py-3 border-b border-white/20">
          <p className="font-medium">
            {user.name}
          </p>

          <p className="text-gray-300 text-xs">
            {user.email}
          </p>
        </div>

        <Link
          href="/profile"
          className="block px-4 py-2 hover:bg-white/10 transition"
        >
          Profile
        </Link>

        <Link
          href="/settings"
          className="block px-4 py-2 hover:bg-white/10 transition"
        >
          Settings
        </Link>

        <button
          onClick={handleLogout}
          className="block w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition"
        >
          Logout
        </button>

      </div>
    )}
  </div>
) : (
  <div className="flex items-center gap-3">

    <button
      onClick={() => setLoginOpen(true)}
      className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition text-white"
    >
      Login
    </button>

    <button
      onClick={() => setSignupOpen(true)}
      className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
    >
      Sign Up
    </button>

  </div>
)}
        </div>
      </div>
    </nav>
    <SignupModal
  isOpen={signupOpen}
  onClose={() => setSignupOpen(false)}
  onSwitchToLogin={() => {
    setSignupOpen(false);
    setLoginOpen(true);
  }}
/>
<LoginModal
  isOpen={loginOpen}
  onClose={() => setLoginOpen(false)}
  onSwitchToSignup={() => {
    setLoginOpen(false);
    setSignupOpen(true);
  }}
/>
</>
  );
}