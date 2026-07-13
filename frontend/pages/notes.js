"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import { useSearch } from "@/context/SearchContext";

export default function Notes() {
  const { query } = useSearch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);

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

  const saveNote = async () => {
    if (!title || !content) return;

    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, {
          title,
          content,
        });
      } else {
        await axios.post(API, {
          title,
          content,
        });
      }

      setTitle("");
      setContent("");
      setEditingId(null);

      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/sky.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-30 pt-32 pb-16 text-white">

        <h1 className="text-2xl font-semibold mb-6">
          <span className="text-indigo-500">My Notes</span>
        </h1>

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
            onClick={saveNote}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>

        </div>

        {filteredNotes.length === 0 ? (
          <p className="text-gray-300">No notes found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="relative backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-indigo-500/10 transition"
              >

                <div className="absolute top-4 right-4 flex gap-3">

                  <button
                    onClick={() => editNote(note)}
                    className="text-blue-400 hover:text-blue-600 transition"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-red-400 hover:text-red-600 transition"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

                <h2 className="text-xl font-semibold mb-2">
                  {note.title}
                </h2>

                <p className="text-gray-300">
                  {note.content}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}