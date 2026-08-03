"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  Search,
  X,
  Menu,
} from "lucide-react";

import { useSearch } from "@/context/SearchContext";

import SignupModal from "./SignupModal";
import LoginModal from "./LoginModal";
import ProfileModal from "./ProfileModal";
import SettingsModal from "./SettingsModal";

export default function Navbar() {

  const pathname = usePathname();
  const router = useRouter();

  const { query, setQuery } = useSearch();

  // ===========================
  // UI States
  // ===========================

  const [signupOpen, setSignupOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const [profileOpen, setProfileOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ===========================
  // Refs
  // ===========================

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // ===========================
  // User
  // ===========================

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ===========================
  // Active Link Style
  // ===========================

  const linkStyle = (path) =>
    pathname === path
      ? "text-white"
      : "text-gray-400 hover:text-white transition";

  // ===========================
  // Outside Click
  // ===========================

  useEffect(() => {
    const handleClickOutside = (e) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }

    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

  }, []);

  // ===========================
  // Logout
  // ===========================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setProfileOpen(false);
    setMobileMenuOpen(false);

    router.push("/");

  };
  return (
  <>
    <nav
      className="
      fixed
      top-6
      left-1/2
      -translate-x-1/2
      z-50
      w-[92%]
      max-w-7xl
      rounded-2xl
      border
      border-white/10
      bg-neutral-900/60
      backdrop-blur-2xl
      shadow-[0_10px_40px_rgba(79,70,229,0.15)]
      transition-all
      duration-300
    "
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ================= Logo ================= */}

        <Link href="/">
          <span
            className="
            text-xl
            font-semibold
            tracking-tight
            bg-gradient-to-r
            from-indigo-400
            to-purple-400
            bg-clip-text
            text-transparent
            cursor-pointer
          "
          >
            Memozi
          </span>
        </Link>

        {/* ================= Desktop Navigation ================= */}

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">

          <Link
            href="/notes"
            className={linkStyle("/notes")}
          >
            Notes
          </Link>

          <Link
            href="/collections"
            className={linkStyle("/collections")}
          >
            Collections
          </Link>

        </div>

        {/* ================= Right Side ================= */}

        <div className="flex items-center gap-4">

          {/* Mobile Hamburger */}

          <button
            onClick={() =>
              setMobileMenuOpen(!mobileMenuOpen)
            }
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          {/* Desktop Controls */}

          <div className="hidden md:flex items-center gap-5">

            {/* ================= Search ================= */}

            <div className="relative">

              <button
                onClick={() =>
                  setSearchOpen(!searchOpen)
                }
                className="text-gray-400 hover:text-white transition"
              >
                <Search size={20} />
              </button>

              {searchOpen && (

                <div
                  className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  rounded-xl
                  border
                  border-white/20
                  bg-white/10
                  backdrop-blur-xl
                  shadow-xl
                  p-3
                "
                >

                  <div className="flex items-center rounded-lg bg-white/10 px-3 py-2">

                    <input
                      type="text"
                      placeholder="Search..."
                      value={query}
                      onChange={(e) =>
                        setQuery(e.target.value)
                      }
                      className="w-full bg-transparent text-sm text-white outline-none"
                    />

                    <X
                      size={16}
                      className="cursor-pointer text-gray-400"
                      onClick={() => {
                        setQuery("");
                        setSearchOpen(false);
                      }}
                    />

                  </div>

                </div>

              )}

            </div>
                        {/* ================= Notifications ================= */}

            <div className="relative" ref={notificationRef}>

              <button
                onClick={() =>
                  setNotificationsOpen(!notificationsOpen)
                }
                className="relative text-gray-400 hover:text-white transition"
              >
                <Bell size={20} />

                <span
                  className="absolute -top-1 -right-1
                  h-2 w-2 rounded-full bg-indigo-500"
                />
              </button>

              {notificationsOpen && (
                <div
                  className="
                  absolute
                  right-0
                  mt-3
                  w-64
                  rounded-xl
                  border
                  border-white/20
                  bg-white/10
                  backdrop-blur-xl
                  shadow-xl
                  p-4
                  text-sm
                  text-white
                "
                >
                  <p className="font-medium mb-2">
                    Notifications
                  </p>

                  <p className="text-gray-300">
                    No new notifications 🎉
                  </p>
                </div>
              )}

            </div>

            {/* ================= Profile ================= */}

            {user ? (

              <div
                className="relative"
                ref={profileRef}
              >

                <button
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="
                  h-9
                  w-9
                  overflow-hidden
                  rounded-full
                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-500
                  flex
                  items-center
                  justify-center
                "
                >
                  {user.profile_picture ? (

                    <img
                      src={`http://localhost:5000/${user.profile_picture}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <span className="text-sm font-semibold text-white">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>

                  )}
                </button>

                {profileOpen && (

                  <div
                    className="
                    absolute
                    right-0
                    mt-3
                    w-56
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/10
                    backdrop-blur-xl
                    shadow-xl
                    py-2
                    text-sm
                    text-white
                  "
                  >

                    <div className="border-b border-white/20 px-4 py-3">

                      <p className="font-medium">
                        {user.name}
                      </p>

                      <p className="text-xs text-gray-300">
                        {user.email}
                      </p>

                    </div>

                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-white/10"
                      onClick={() => {
                        setProfileOpen(false);
                        setProfileModalOpen(true);
                      }}
                    >
                      Profile
                    </button>

                    <button
                      className="block w-full px-4 py-2 text-left hover:bg-white/10"
                      onClick={() => {
                        setProfileOpen(false);
                        setSettingsOpen(true);
                      }}
                    >
                      Settings
                    </button>

                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10"
                    >
                      Logout
                    </button>

                  </div>

                )}

              </div>

            ) : (

              <div className="flex items-center gap-3">

                <button
                  onClick={() =>
                    setLoginOpen(true)
                  }
                  className="
                  rounded-lg
                  border
                  border-white/20
                  px-4
                  py-2
                  text-white
                  hover:bg-white/10
                "
                >
                  Login
                </button>

                <button
                  onClick={() =>
                    setSignupOpen(true)
                  }
                  className="
                  rounded-lg
                  bg-gradient-to-r
                  from-indigo-500
                  to-purple-500
                  px-4
                  py-2
                  text-white
                "
                >
                  Sign Up
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

    </nav>
          {/* ===========================
          Mobile Backdrop
      =========================== */}

      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`
          fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
          transition-all duration-300
          md:hidden
          ${
            mobileMenuOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* ===========================
          Mobile Drawer
      =========================== */}

      <div
  className={`
    fixed
    top-0
    right-0
    h-screen
    w-[320px]
    z-50

    bg-white/8
    backdrop-blur-3xl
    border-l border-white/10

    transform
    transition-all
    duration-500
    ease-[cubic-bezier(.22,1,.36,1)]

    ${
      mobileMenuOpen
        ? "translate-x-0"
        : "translate-x-full"
    }

    overflow-hidden
    md:hidden
  `}
>
        <div className="flex flex-col h-full">

          {/* Header */}

          <div className="flex items-center justify-between p-6 border-b border-white/10">

            <h2 className="text-xl font-semibold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Memozi
            </h2>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-300 hover:text-white"
            >
              <X size={24} />
            </button>

          </div>

          {/* Search */}

          <div className="p-5">

            <div className="flex items-center rounded-xl bg-white/10 px-3 py-3">

              <Search
                size={18}
                className="mr-2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                className="w-full bg-transparent outline-none text-white placeholder:text-gray-500"
              />

            </div>

          </div>

          {/* Navigation */}

          <div className="px-5 flex flex-col gap-2">

            <Link
              href="/notes"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white hover:bg-white/10 transition"
            >
              Notes
            </Link>

            <Link
              href="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-xl px-4 py-3 text-white hover:bg-white/10 transition"
            >
              Collections
            </Link>

          </div>

          <div className="mx-5 my-5 border-t border-white/10"></div>

          {/* User */}

          <div className="flex-1 px-5">

            {user ? (

              <>

                <div className="flex items-center gap-3 mb-6">

                  {user.profile_picture ? (

                    <img
                      src={`http://localhost:5000/${user.profile_picture}`}
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover"
                    />

                  ) : (

                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>

                  )}

                  <div>

                    <p className="text-white font-medium">
                      {user.name}
                    </p>

                    <p className="text-gray-400 text-sm">
                      {user.email}
                    </p>

                  </div>

                </div>

                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 hover:bg-white/10 text-white"
                >
                  Profile
                </button>

                <button
                  onClick={() => {
                    setSettingsOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left rounded-xl px-4 py-3 hover:bg-white/10 text-white"
                >
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left rounded-xl px-4 py-3 text-red-400 hover:bg-red-500/10"
                >
                  Logout
                </button>

              </>

            ) : (

              <div className="flex flex-col gap-4">

                <button
                  onClick={() => {
                    setLoginOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl border border-white/20 py-3 text-white hover:bg-white/10"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    setSignupOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 py-3 text-white"
                >
                  Sign Up
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* ===========================
          Modals
      =========================== */}

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

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        setUser={setUser}
      />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

    </>
  );
}