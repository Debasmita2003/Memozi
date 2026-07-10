"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function Bookmarks() {
  const { query } = useSearch(); // ✅ hook inside component

  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API = "http://localhost:5000/api/bookmarks";

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await axios.get(API);
      setBookmarks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bookmarks.");
    }
  };

  const addBookmark = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !url) {
      setError("Please fill all fields.");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setError("URL must start with http:// or https://");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(API, { title, url });
      setBookmarks([...bookmarks, res.data]);
      setTitle("");
      setUrl("");
    } catch (err) {
      console.error(err);
      setError("Failed to add bookmark.");
    } finally {
      setLoading(false);
    }
  };

  const deleteBookmark = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setBookmarks(bookmarks.filter((b) => b._id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete bookmark.");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/sky.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-30 pt-32 pb-16 text-white">

        {/* Page Title */}
        <h1 className="text-2xl font-semibold mb-6">
          <span className="text-indigo-500">My Bookmarks</span>
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-400">{error}</div>
        )}

        {/* Add Bookmark Form */}
        <form
          onSubmit={addBookmark}
          className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 mb-10 shadow-xl"
        >
          <input
            type="text"
            placeholder="Bookmark Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-indigo-400"
          />

          <input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-indigo-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={16} />
            {loading ? "Adding..." : "Add Bookmark"}
          </button>
        </form>

        {/* Empty State */}
        {bookmarks.length === 0 ? (
          <p className="text-gray-300">No bookmarks yet. Add one above.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-indigo-500/10 transition relative"
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteBookmark(bookmark._id)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>

                <h2 className="text-xl font-semibold mb-2">
                  {bookmark.title}
                </h2>

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 flex items-center gap-2 hover:underline"
                >
                  <LinkIcon size={16} />
                  Visit
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}