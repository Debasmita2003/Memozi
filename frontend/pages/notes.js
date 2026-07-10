"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function Notes() {
  const { query } = useSearch(); // ✅ inside component

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);


  const API = "http://localhost:5000/api/notes";

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await axios.get(API);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addNote = async () => {
    if (!title || !content) return;

    try {
      await axios.post(API, { title, content });
      setTitle("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/sky.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-30 pt-32 pb-16 text-white">

        {/* Title */}
        <h1 className="text-2xl font-semibold mb-6">
          <span className="text-indigo-500">My Notes</span>
        </h1>

        {/* Add Note Form */}
        <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 mb-10 shadow-xl">
          <input
            type="text"
            placeholder="Title"
            className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-indigo-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Write your note..."
            className="w-full mb-4 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-indigo-400"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            onClick={addNote}
            className="px-6 py-2 rounded-lg 
              bg-gradient-to-r from-indigo-500 to-purple-500 
              hover:opacity-90 transition"
          >
            Add Note
          </button>
        </div>

        {/* Notes List */}
        {notes.length === 0 ? (
          <p className="text-gray-300">No notes yet. Add one above.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {notes.map((note) => (
              <div
                key={note._id}
                className="relative backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-indigo-500/10 transition"
              >
                {/* Delete Button */}
                <button
                  onClick={() => deleteNote(note._id)}
                  className="absolute top-4 right-4 text-red-400 hover:text-red-600 transition"
                >
                  <Trash2 size={18} />
                </button>

                <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
                <p className="text-gray-300">{note.content}</p>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}