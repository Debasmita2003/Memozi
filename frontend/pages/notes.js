"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Trash2,
  Pencil,
  Palette,
  Pin,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo2,
  Redo2,
} from "lucide-react";

import { useSearch } from "@/context/SearchContext";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {TextStyle} from "@tiptap/extension-text-style";
import {Color} from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";

export default function Notes() {
  const { query } = useSearch();

  /* ----------------------- States ----------------------- */

  const [title, setTitle] = useState("");

  const [titleColor, setTitleColor] = useState("#ffffff");

  const [notes, setNotes] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [showTitlePalette, setShowTitlePalette] = useState(false);

  const [showContentPalette, setShowContentPalette] = useState(false);

  const [pinned, setPinned] = useState(false);

  const [spellCheck, setSpellCheck] = useState(true);

  const titlePickerRef = useRef(null);

  const contentPickerRef = useRef(null);

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

  /* -------------------- TipTap Editor -------------------- */

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Write your note...",
        emptyEditorClass: "is-editor-empty",
      }),
    ],

    content: "",

    editorProps: {
      attributes: {
        class:
          "min-h-[170px] p-4 outline-none text-white",
        spellcheck: spellCheck ? "true" : "false",
      },
    },
  });

  /* -------------------- Load Notes -------------------- */

  useEffect(() => {
    fetchNotes();
  }, []);

  /* -------------------- Spell Check -------------------- */

  useEffect(() => {
    const loadSettings = () => {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      setSpellCheck(user.spell_check ?? true);
    };

    loadSettings();

    window.addEventListener("settingsUpdated", loadSettings);

    return () =>
      window.removeEventListener(
        "settingsUpdated",
        loadSettings
      );
  }, []);

  /* -------- Update TipTap when spell check changes ------- */

  useEffect(() => {
    if (!editor) return;

    editor.setOptions({
      editorProps: {
        attributes: {
          class:
            "min-h-[170px] p-4 outline-none text-white",
          spellcheck: spellCheck ? "true" : "false",
        },
      },
    });
  }, [spellCheck, editor]);

  /* -------------------- Close Palettes ------------------- */

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
  /* -------------------- Fetch Notes -------------------- */

const fetchNotes = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const res = await axios.get(`${API}/${user.id}`);

    setNotes(res.data);
  } catch (err) {
    console.error(err);
  }
};

/* -------------------- Save Note -------------------- */

const saveNote = async () => {
  const content = editor?.getHTML();

  if (!title.trim()) return;

  if (!content || content === "<p></p>") return;

  const user = JSON.parse(localStorage.getItem("user"));

  try {
    if (editingId) {
      await axios.put(`${API}/${editingId}`, {
        title,
        content,
        titleColor,
        pinned,
        userId: user.id,
      });
    } else {
      await axios.post(API, {
        title,
        content,
        titleColor,
        pinned,
        userId: user.id,
      });
    }

    // Reset everything
    setTitle("");

    editor?.commands.clearContent();

    setTitleColor("#ffffff");

    setPinned(false);

    setEditingId(null);

    setShowTitlePalette(false);

    setShowContentPalette(false);

    fetchNotes();

  } catch (err) {
    console.error(err);
  }
};

/* -------------------- Edit Note -------------------- */

const editNote = (note) => {
  setTitle(note.title);

  editor?.commands.setContent(note.content);

  setTitleColor(note.title_color || "#ffffff");

  setPinned(note.pinned);

  setEditingId(note.id);

  setShowTitlePalette(false);

  setShowContentPalette(false);

  editor?.commands.focus("end");
};

/* -------------------- Delete Note -------------------- */

const deleteNote = async (id) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await axios.delete(`${API}/${id}/${user.id}`);

    fetchNotes();

  } catch (err) {
    console.error(err);
  }
};

/* -------------------- Search -------------------- */

const filteredNotes = notes.filter((note) => {
  const search = query.toLowerCase();

  return (
    (note.title || "")
      .toLowerCase()
      .includes(search) ||

    (note.content || "")
      .toLowerCase()
      .includes(search)
  );
});

/* -------------------- Pin Sort -------------------- */

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
      <span className="text-indigo-500">
        My Notes
      </span>
    </h1>

    <div className="backdrop-blur-xl bg-white/10 p-6 rounded-2xl border border-white/20 shadow-xl mb-10">

      {/* ---------------- Title ---------------- */}

      <div
        ref={titlePickerRef}
        className="relative mb-4"
      >

        <input
          type="text"
          placeholder="Title"
          value={title}
          spellCheck={spellCheck}
          autoCorrect={spellCheck ? "on" : "off"}
          autoCapitalize="sentences"
          style={{ color: titleColor }}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-white/10 p-3 pr-12 outline-none focus:border-indigo-400"
        />

        <button
          type="button"
          onClick={() => {
            setShowTitlePalette((prev) => !prev);
            setShowContentPalette(false);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-indigo-400"
        >
          <Palette size={18} />
        </button>

        {showTitlePalette && (
          <div className="absolute right-0 top-14 z-50 grid grid-cols-5 gap-2 rounded-xl border border-white/20 bg-black/40 p-3 backdrop-blur-xl">

            {palette.map((c) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                className="h-6 w-6 rounded-full border border-white/20 hover:scale-110 transition"
                onClick={() => {
                  setTitleColor(c);
                  setShowTitlePalette(false);
                }}
              />
            ))}

          </div>
        )}

      </div>

      {/* ---------------- Editor ---------------- */}

      <div
        ref={contentPickerRef}
        className="relative"
      >

        {/* Toolbar */}

        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/5 p-2 rounded-t-xl">

          <button
            onClick={() =>
              editor?.chain().focus().toggleBold().run()
            }
            className="rounded p-2 hover:bg-white/10"
          >
            <Bold size={16} />
          </button>

          <button
            onClick={() =>
              editor?.chain().focus().toggleItalic().run()
            }
            className="rounded p-2 hover:bg-white/10"
          >
            <Italic size={16} />
          </button>

          <button
  onClick={() => {
    editor?.chain().focus().toggleBulletList().run();
    console.log(editor?.getHTML());
  }}
  className="rounded p-2 hover:bg-white/10"
>
  <List size={16} />
</button>

          <button
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleOrderedList()
                .run()
            }
            className="rounded p-2 hover:bg-white/10"
          >
            <ListOrdered size={16} />
          </button>

          <button
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: 1 })
                .run()
            }
            className="rounded p-2 hover:bg-white/10"
          >
            <Heading1 size={16} />
          </button>

          <button
            onClick={() =>
              editor
                ?.chain()
                .focus()
                .toggleHeading({ level: 2 })
                .run()
            }
            className="rounded p-2 hover:bg-white/10"
          >
            <Heading2 size={16} />
          </button>
<button
  onClick={() => editor.chain().focus().undo().run()}
  className="p-2 rounded hover:bg-white/20"
>
  <Undo2 size={16} />
</button>

<button
  onClick={() => editor.chain().focus().redo().run()}
  className="p-2 rounded hover:bg-white/20"
>
  <Redo2 size={16} />
</button>
          {/* Text Color */}

          <button
            onClick={() => {
              setShowContentPalette((prev) => !prev);
              setShowTitlePalette(false);
            }}
            className="ml-auto rounded p-2 hover:bg-white/10"
          >
            <Palette size={16} />
          </button>

        </div>

        {/* Color Palette */}

        {showContentPalette && (
          <div className="absolute right-0 top-12 z-50 grid grid-cols-5 gap-2 rounded-xl border border-white/20 bg-black/40 p-3 backdrop-blur-xl">

            {palette.map((c) => (
              <button
                key={c}
                style={{ backgroundColor: c }}
                className="h-6 w-6 rounded-full border border-white/20 hover:scale-110 transition"
                onClick={() => {
                  editor
                    ?.chain()
                    .focus()
                    .setColor(c)
                    .run();

                  setShowContentPalette(false);
                }}
              />
            ))}

          </div>
        )}

        {/* TipTap */}

        <div className="rounded-b-xl border border-white/20 bg-white/10">

          <EditorContent editor={editor} />

        </div>

      </div>
            {/* ---------- Action Buttons ---------- */}

      <div className="mt-5 flex items-center gap-3">

        <button
          onClick={saveNote}
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-2 hover:opacity-90 transition"
        >
          {editingId ? "Update Note" : "Add Note"}
        </button>

        <button
          onClick={() => setPinned(!pinned)}
          className={`rounded-lg p-2 transition ${
            pinned
              ? "bg-yellow-500 text-white"
              : "bg-white/10 text-gray-300"
          }`}
        >
          <Pin size={18} />
        </button>

      </div>

    </div>

    {/* ---------- Notes ---------- */}

    {filteredNotes.length === 0 ? (

      <p className="mt-10 text-center text-lg text-gray-400">
        🔍 No notes match your search.
      </p>

    ) : (

      <div className="grid gap-6 md:grid-cols-2">
              {sortedNotes.map((note) => (

          <div
            key={note.id}
            className="relative rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:bg-white/15 hover:shadow-indigo-500/20"
            style={{
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >

            {/* Top Right Icons */}

            <div className="absolute right-4 top-4 flex items-center gap-3">

              {note.pinned && (
                <Pin
                  size={18}
                  className="fill-yellow-400 text-yellow-400"
                />
              )}

              <button
                onClick={() => editNote(note)}
                className="text-blue-400 transition hover:text-blue-600"
              >
                <Pencil size={18} />
              </button>

              <button
                onClick={() => deleteNote(note.id)}
                className="text-red-400 transition hover:text-red-600"
              >
                <Trash2 size={18} />
              </button>

            </div>

            {/* Title */}

            <h2
              className="mb-3 text-xl font-semibold"
              style={{
                color: note.title_color,
              }}
            >
              {note.title}
            </h2>

            {/* Rich Text Content */}

            <div
              className="prose prose-invert max-w-none break-words"
              dangerouslySetInnerHTML={{
                __html: note.content,
              }}
            />

          </div>

        ))}

      </div>

    )}

  </div>

</div>
);
}