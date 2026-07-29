"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Trash2, Pencil, Palette , Pin} from "lucide-react";
import { useSearch } from "@/context/SearchContext";


export default function Notes() {
  const { query } = useSearch();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleColor, setTitleColor] = useState("#ffffff");
  const [contentColor, setContentColor] = useState("#d1d5db");
  const [notes, setNotes] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showTitlePalette, setShowTitlePalette] = useState(false);
  const [showContentPalette, setShowContentPalette] = useState(false);
  const titlePickerRef = useRef(null);
  const contentPickerRef = useRef(null);
  const [pinned, setPinned] = useState(false);

  const palette = [
  "#FFFFFF",
  "#F8FAFC",
  "#E2E8F0",
  "#94A3B8",

  "#F87171",
  "#FB7185",
  "#F472B6",
  "#C084FC",

  "#818CF8",
  "#60A5FA",
  "#38BDF8",
  "#22D3EE",

  "#2DD4BF",
  "#4ADE80",
  "#A3E635",
  "#FACC15",

  "#FB923C",
  "#F97316",
  "#A16207",
  "#000000",
];

  const API = "http://localhost:5000/api/notes";

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      titlePickerRef.current &&
      !titlePickerRef.current.contains(event.target)
    ) {
      setShowTitlePalette(false);
    }

    if (
      contentPickerRef.current &&
      !contentPickerRef.current.contains(event.target)
    ) {
      setShowContentPalette(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const fetchNotes = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

const res = await axios.get(`${API}/${user.id}`);
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const saveNote = async () => {
  if (!title || !content) return;
  const user = JSON.parse(localStorage.getItem("user"));
  try {
    if (editingId) {
      await axios.put(`${API}/${editingId}`, {
        title,
        content,
        titleColor,
        contentColor,
        pinned,
        userId: user.id,
      });
    } else {
      await axios.post(API, {
        title,
        content,
        titleColor,
        contentColor,
        pinned,
        userId: user.id,
      });
    }

    setTitle("");
    setContent("");
    setTitleColor("#ffffff");
    setContentColor("#d1d5db");
    setEditingId(null);
    setPinned(false);
    setShowTitlePalette(false);
    setShowContentPalette(false);
    
    fetchNotes();
  } catch (err) {
    console.error(err);
  }
};

  const editNote = (note) => {
  setTitle(note.title);
  setContent(note.content);
  setTitleColor(note.title_color);
  setContentColor(note.content_color);
  setEditingId(note.id);
  setPinned(note.pinned);
};

  const deleteNote = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

await axios.delete(`${API}/${id}/${user.id}`);
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = notes.filter((note) => {
  const search = query.toLowerCase();

  return (
    (note.title || "").toLowerCase().includes(search) ||
    (note.content || "").toLowerCase().includes(search)
  );
});
// ⭐ Sort pinned notes first
const sortedNotes = [...filteredNotes].sort(
  (a, b) => Number(b.pinned) - Number(a.pinned)
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

          <div
  ref={titlePickerRef}
  className="relative mb-4"
>

  <input
    type="text"
    placeholder="Title"
    value={title}
    style={{ color: titleColor }}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-indigo-400 pr-12"
  />

  <button
  type="button"
  onClick={() => {
    setShowTitlePalette((prev) => !prev);
    setShowContentPalette(false);
  }}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-white transition-colors duration-300 hover:text-indigo-500"
>
  <Palette size={18} />
</button>

  {showTitlePalette && (
    <div className="absolute right-0 top-14 z-50 p-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-xl grid grid-cols-5 gap-2">

      {palette.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => {
            setTitleColor(c);
            setShowTitlePalette(false);
          }}
          style={{ backgroundColor: c }}
          className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition"
        />
      ))}

    </div>
  )}

</div>
          <div
  ref={contentPickerRef}
  className="relative mb-5"
>
  <textarea
    placeholder="Write your note..."
    rows="4"
    value={content}
    style={{ color: contentColor }}
    onChange={(e) => setContent(e.target.value)}
    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:border-indigo-400 pr-12"
  />

  <button
  type="button"
  onClick={() => {
    setShowContentPalette((prev) => !prev);
    setShowTitlePalette(false);
  }}
  className="absolute right-3 top-3 text-white transition-colors duration-300 hover:text-indigo-500"
>
  <Palette size={18} />
</button>

 {showContentPalette && (
  <div
    className="absolute right-0 top-14 z-50 p-3 rounded-xl bg-black/40 backdrop-blur-xl border border-white/20 shadow-xl grid grid-cols-5 gap-2"
  >
      {palette.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => {
            setContentColor(c);
            setShowContentPalette(false);
          }}
          style={{ backgroundColor: c }}
          className="w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition"
        />
      ))}
    </div>
  )}
</div>

          <button
            onClick={saveNote}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
          >
            {editingId ? "Update Note" : "Add Note"}
          </button>
<button
onClick={() => setPinned(!pinned)}
className={`ml-3 p-2 rounded-lg transition ${
pinned
? "bg-yellow-500 text-white"
: "bg-white/10 text-gray-300"
}`}
>
<Pin size={18}/>
</button>
        </div>

        {filteredNotes.length === 0 ? (
          <p className="text-center text-gray-400 text-lg mt-10">
  🔍 No notes match your search.
</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {sortedNotes.map((note) => (
              <div
  key={note.id}
  className="relative backdrop-blur-xl bg-white/10 hover:bg-white/15 p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
  style={{
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
}}
>

                <div className="absolute top-4 right-4 flex items-center gap-3">

  {note.pinned && (
    <Pin
      size={18}
      className="text-yellow-400 fill-yellow-400"
    />
  )}

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

                <h2
  className="text-xl font-semibold mb-2"
  style={{ color: note.title_color }}
>
  {note.title}
</h2>

<p
  className="leading-7 whitespace-pre-wrap"
  style={{ color: note.content_color }}
>
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