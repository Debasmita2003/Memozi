"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Plus,
  Folder,
  Trash2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Collections() {
  const API = "http://localhost:5000/api/collections";

  // ===============================
  // State
  // ===============================

  const [collections, setCollections] = useState([]);
  const [collectionNotes, setCollectionNotes] = useState({});
  const [expandedCollection, setExpandedCollection] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("📁");

  const [availableNotes, setAvailableNotes] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);

  // ===============================
  // Fetch Collections
  // ===============================

  const fetchCollections = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) return;

      const res = await axios.get(
        `${API}/user/${user.id}`
      );

      setCollections(res.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  // ===============================
  // Fetch Notes Inside Collection
  // ===============================

  const fetchCollectionNotes = async (collectionId) => {
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

  // ===============================
  // Expand / Collapse
  // ===============================

  const toggleCollection = async (collectionId) => {

    if (expandedCollection === collectionId) {
      setExpandedCollection(null);
      return;
    }

    setExpandedCollection(collectionId);

    await fetchCollectionNotes(collectionId);

  };

  // ===============================
  // Create Collection
  // ===============================

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

      await fetchCollections();

    } catch (err) {
      console.error(err);
    }

  };

  // ===============================
  // Delete Collection
  // ===============================

  const deleteCollection = async (id) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      await axios.delete(
        `${API}/delete/${id}/${user.id}`
      );

      if (expandedCollection === id) {
        setExpandedCollection(null);
      }

      setCollectionNotes((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      await fetchCollections();

    } catch (err) {
      console.error(err);
    }

  };

  // ===============================
  // Open Add Notes
  // ===============================

  const openAddNotes = async (collectionId) => {

    try {

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await axios.get(
        `${API}/${collectionId}/available/${user.id}`
      );

      setAvailableNotes(res.data);
      setSelectedNotes([]);
      setActiveCollection(collectionId);
      setShowAddModal(true);

    } catch (err) {
      console.error(err);
    }

  };

  // ===============================
  // Add Notes
  // ===============================

  const addNotesToCollection = async () => {

    try {

      await axios.post(`${API}/add-note`, {
        collectionId: activeCollection,
        noteIds: selectedNotes,
      });

      await fetchCollectionNotes(activeCollection);
      await fetchCollections();

      setShowAddModal(false);

    } catch (err) {
      console.error(err);
    }

  };

  // ===============================
  // Remove Note
  // ===============================

  const removeNoteFromCollection = async (
    collectionId,
    noteId
  ) => {

    try {

      await axios.delete(
        `${API}/remove-note/${collectionId}/${noteId}`
      );

      await fetchCollectionNotes(collectionId);
      await fetchCollections();

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
          <h1 className="text-3xl font-bold text-white">
            My Collections
          </h1>

          <p className="text-gray-400 mt-2">
            Organize your notes into beautiful collections.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
        >
          <Plus size={18} />
          New Collection
        </button>

      </div>

      {/* Empty State */}

      {collections.length === 0 ? (

        <div className="text-center mt-28">

          <Folder
            size={70}
            className="mx-auto text-gray-500 mb-6"
          />

          <h2 className="text-3xl text-white font-semibold">
            No Collections Yet
          </h2>

          <p className="text-gray-400 mt-3">
            Create your first collection and organize your notes.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {collections.map((collection) => (

            <div
              key={collection.id}
              className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl overflow-hidden"
            >

              {/* Collection Header */}

              <div
                className="flex justify-between items-center px-6 py-5 cursor-pointer hover:bg-white/5"
                onClick={() => toggleCollection(collection.id)}
              >

                <div className="flex items-center gap-5">

                  <div className="text-4xl">
                    {collection.icon}
                  </div>

                  <div>

                    <h2 className="text-xl font-semibold text-white">
                      {collection.name}
                    </h2>

                    <p className="text-gray-400 text-sm">
                      {collection.note_count} Notes
                    </p>

                  </div>

                </div>

                <div
                  className="flex items-center gap-3"
                  onClick={(e) => e.stopPropagation()}
                >

                  <button
                    onClick={() =>
                      openAddNotes(collection.id)
                    }
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:opacity-90"
                  >
                    <Plus size={18} />
                    Add Existing Notes
                  </button>

                  <button
                    onClick={() =>
                      deleteCollection(collection.id)
                    }
                    className="text-red-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>

                  {expandedCollection === collection.id ? (
                    <ChevronDown
                      className="text-gray-300"
                      onClick={() =>
                        toggleCollection(collection.id)
                      }
                    />
                  ) : (
                    <ChevronRight
                      className="text-gray-300"
                      onClick={() =>
                        toggleCollection(collection.id)
                      }
                    />
                  )}

                </div>

              </div>

              {/* Expanded Section */}

              {expandedCollection === collection.id && (

                <div className="border-t border-white/10 p-5">

                  {collectionNotes[collection.id]?.length === 0 ? (

                    <p className="text-gray-400">
                      No notes in this collection.
                    </p>

                  ) : (

                    <div className="space-y-4">

                      {(collectionNotes[collection.id] || []).map((note) => (

                        <div
                          key={note.id}
                          className="flex justify-between items-start bg-white/5 border border-white/10 rounded-xl p-4"
                        >

                          <div>

                            <h3 className="text-white font-semibold">
                              {note.title}
                            </h3>

                            <p className="text-gray-400 mt-2 text-sm">
                              {note.content.length > 120
                                ? note.content.substring(0, 120) + "..."
                                : note.content}
                            </p>

                          </div>

                          <button
                            onClick={() =>
                              removeNoteFromCollection(
                                collection.id,
                                note.id
                              )
                            }
                            className="text-red-400 hover:text-red-500"
                            title="Remove Note"
                          >
                            <Trash2 size={18} />
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
          {/* ==========================
          Create Collection Modal
      =========================== */}

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowModal(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50">

            <div className="w-[400px] rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6">

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
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
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

      {/* ==========================
          Add Existing Notes Modal
      =========================== */}

      {showAddModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setShowAddModal(false)}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50">

            <div className="w-[550px] max-h-[600px] overflow-y-auto rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6">

              <h2 className="text-2xl font-semibold text-white mb-6">
                Add Existing Notes
              </h2>

              {availableNotes.length === 0 ? (

                <p className="text-gray-400">
                  No available notes.
                </p>

              ) : (

                <div className="space-y-3">

                  {availableNotes.map((note) => (

                    <label
                      key={note.id}
                      className="flex items-start gap-3 bg-white/5 rounded-xl p-3 cursor-pointer border border-white/10"
                    >

                      <input
                        type="checkbox"
                        checked={selectedNotes.includes(note.id)}
                        onChange={(e) => {

                          if (e.target.checked) {

                            setSelectedNotes([
                              ...selectedNotes,
                              note.id,
                            ]);

                          } else {

                            setSelectedNotes(
                              selectedNotes.filter(
                                (id) => id !== note.id
                              )
                            );

                          }

                        }}
                      />

                      <div>

                        <h3 className="text-white font-medium">
                          {note.title}
                        </h3>

                        <p className="text-gray-400 text-sm mt-1">
                          {note.content.length > 90
                            ? note.content.substring(0, 90) + "..."
                            : note.content}
                        </p>

                      </div>

                    </label>

                  ))}

                </div>

              )}

              <div className="flex justify-end gap-3 mt-6">

                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={addNotesToCollection}
                  disabled={selectedNotes.length === 0}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white disabled:opacity-50"
                >
                  Add Notes
                </button>

              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}