const API_BASE_URL = "http://localhost:5000";

export async function getNotes() {
  const res = await fetch(`${API_BASE_URL}/api/notes`);
  return res.json();
}

export async function createNote(note) {
  const res = await fetch(`${API_BASE_URL}/api/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  });
  return res.json();
}

export async function deleteNote(id) {
  const res = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
    method: "DELETE",
  });
  return res.json();
}

// --------- BOOKMARKS API ---------

export async function getBookmarks() {
  const res = await fetch("http://localhost:5000/api/bookmarks");
  return res.json();
}

export async function createBookmark(bookmark) {
  const res = await fetch("http://localhost:5000/api/bookmarks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bookmark),
  });
  return res.json();
}

export async function deleteBookmark(id) {
  const res = await fetch(
    `http://localhost:5000/api/bookmarks/${id}`,
    { method: "DELETE" }
  );
  return res.json();
}