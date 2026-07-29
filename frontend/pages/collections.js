"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Folder,
  Trash2,
  ChevronDown,
  ChevronRight,
  FileText,
} from "lucide-react";

export default function Collections() {
  const API = "http://localhost:5000/api/collections";

  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");
  const [expandedCollection, setExpandedCollection] = useState(null);
  const [collectionNotes, setCollectionNotes] = useState({});

  // ===========================
  // Fetch Collections
  // ===========================

  const fetchCollections = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await axios.get(`${API}/${user.id}`);

      setCollections(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // ===========================
  // Create Collection
  // ===========================

  const createCollection = async () => {
    if (!name.trim()) return;

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.post(API, {
        userId: user.id,
        name,
        icon,
      });

      setName("");
      setIcon("📁");
      setShowModal(false);

      fetchCollections();

    } catch (err) {
      console.error(err);
    }
  };

  // ===========================
  // Delete Collection
  // ===========================

  const deleteCollection = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await axios.delete(`${API}/${id}/${user.id}`);

      fetchCollections();

    } catch (err) {
      console.error(err);
    }
  };
const toggleCollection = async (collectionId) => {
  if (expandedCollection === collectionId) {
    setExpandedCollection(null);
    return;
  }

  setExpandedCollection(collectionId);

  try {
    const res = await axios.get(
      `${API}/${collectionId}/notes`
    );

    setCollectionNotes((prev) => ({
      ...prev,
      [collectionId]: res.data,
    }));
  } catch (err) {
    console.error(err);
  }
};
  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/sky.jpg')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 pt-32 pb-16">

        {/* Header */}
        <div className="flex justify-between items-center mb-10">

          <div>
            <h1 className="text-2xl font-semibold mb-6">
          <span className="text-indigo-500">My Collections</span>
        </h1>

            <p className="text-gray-300 mt-2">
              Organize your notes into collections.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition text-white"
          >
            <Plus size={18} />
            New Collection
          </button>

        </div>

        {/* Empty State */}

        {collections.length === 0 ? (
          <div className="text-center mt-32">

            <Folder
              size={60}
              className="mx-auto text-gray-400 mb-5"
            />

            <h2 className="text-2xl text-white">
              No Collections Yet
            </h2>

            <p className="text-gray-400 mt-2">
              Create your first collection to organize notes.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

  {collections.map((collection) => (

    <div
      key={collection.id}
      className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition"
    >

      {/* Header */}

      <div
        onClick={() => toggleCollection(collection.id)}
        className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-white/5"
      >

        <div className="flex items-center gap-5">

          <div className="text-5xl">
            {collection.icon}
          </div>

          <div>

            <h2 className="text-xl font-semibold text-white">
              {collection.name}
            </h2>

            <p className="text-gray-400 text-sm">
              {collectionNotes[collection.id]?.length || 0} Notes
            </p>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteCollection(collection.id);
            }}
            className="text-red-400 hover:text-red-500"
          >
            <Trash2 size={18} />
          </button>

          {expandedCollection === collection.id ? (
            <ChevronDown className="text-gray-300" />
          ) : (
            <ChevronRight className="text-gray-300" />
          )}

        </div>

      </div>

      {/* Expanded Area */}

      {expandedCollection === collection.id && (

        <div className="border-t border-white/10 p-6">

          <button
            className="mb-5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
          >
            + Add Existing Note
          </button>

          {collectionNotes[collection.id]?.length === 0 ? (

            <p className="text-gray-400">
              No notes added yet.
            </p>

          ) : (

            <div className="space-y-3">

              {(collectionNotes[collection.id] || []).map((note) => (

                <div
                  key={note.id}
                  className="flex justify-between items-center rounded-xl bg-white/5 p-4"
                >

                  <div className="flex items-center gap-3">

                    <FileText
                      size={18}
                      className="text-indigo-400"
                    />

                    <span className="text-white">
                      {note.title}
                    </span>

                  </div>

                  <button
                    className="text-red-400 hover:text-red-500"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      )}

    </div>

  ))}

</div>
        )}

      </div>

      {/* Create Collection Modal */}

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowModal(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50">

            <div className="w-[380px] rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6">

              <h2 className="text-2xl font-semibold text-white mb-6">
                New Collection
              </h2>

              <input
                type="text"
                placeholder="Collection Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mb-4 p-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none"
              />

              <input
                type="text"
                placeholder="Emoji (📚)"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full mb-6 p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none"
              />

              <div className="flex justify-end gap-3">

                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
                >
                  Cancel
                </button>

                <button
                  onClick={createCollection}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                >
                  Create
                </button>

              </div>

            </div>

          </div>
        </>
      )}
    </div>
  );
}