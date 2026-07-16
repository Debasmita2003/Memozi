# 📝 Memozi

A modern full-stack note-taking application built with **Next.js**, **Express.js**, and **PostgreSQL**. Memozi allows users to create, manage, and organize notes through a clean and responsive interface.

---

## ✨ Features

- 📝 Create notes
- 📖 View all saved notes
- 🗑️ Delete notes
- ✏️ Edit notes
- 🎨 Custom note colors
- 💾 Persistent storage with PostgreSQL
- 🎨 Modern glassmorphism UI
- 📱 Responsive design
- 👤 User Authentication

---

## 📸 Preview

> Add screenshots of your application here.

Example:

```
screenshots/
├── home.png
├── notes.png
└── bookmarks.png
```

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- CSS

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- pg

---

## 📂 Project Structure

```
Memozi/
│
├── Frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── services/
│   └── package.json
│
├── Backend/
│   ├── config/
│   ├── routes/
│   ├── package.json
│   ├── server.js
│   └── .env
│
├── .gitignore
└── README.md
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/Memozi.git
cd Memozi
```

---

### 2. Install Frontend Dependencies

```bash
cd Frontend
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd ../Backend
npm install
```

---

## 🗄️ Database Setup

Install PostgreSQL and create a database named:

```
memozi
```

Create the required tables.

### Notes Table

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    color VARCHAR(30) DEFAULT '#ffffff',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Bookmarks Table

```sql
CREATE TABLE bookmarks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the **Backend** folder.

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=memozi

PORT=5000
```

---

## ▶️ Running the Application

### Start Backend

```bash
cd Backend
npm start
```

Backend runs on:

```
http://localhost:5000
```

---

### Start Frontend

```bash
cd Frontend
npm run dev
```

Frontend runs on:

```
http://localhost:3000
```

---

## 📡 API Endpoints

### Notes

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/notes` | Get all notes |
| POST | `/api/notes` | Create a new note |
| DELETE | `/api/notes/:id` | Delete a note |

### Bookmarks

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/bookmarks` | Get all bookmarks |
| POST | `/api/bookmarks` | Create a bookmark |
| DELETE | `/api/bookmarks/:id` | Delete a bookmark |

---

## 🔮 Future Improvements

- 📌 Pin notes
- 🔖 Bookmark support
- 🔍 Search functionality
- 🏷️ Categories & Tags
- ☁️ Cloud Deployment
- 📱 Progressive Web App (PWA)

---

## 👩‍💻 Author

**Debasmita Jana**

- GitHub: https://github.com/Debasmita2003