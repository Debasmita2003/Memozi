# 📝 Memozi

A modern full-stack note-taking application built with **Next.js, React, Express.js, PostgreSQL, and Cloudinary**.

Memozi allows users to securely create, edit, organize, search, pin, and manage their personal notes with persistent cloud storage and profile management.

---

## 🌐 Live Demo

🚀 **Memozi:**  
https://memozi-project.vercel.app/

---

## ✨ Features

### 📝 Notes

- 📝 Create notes
- ✏️ Edit notes
- 🗑️ Delete notes
- 📖 View saved notes
- 📌 Pin important notes
- 🎨 Customize note colors
- 🔍 Search notes
- 💾 Persistent database storage
- 👤 User-specific notes

### 👤 Authentication

- 📝 User registration
- 🔐 Secure login
- 🔑 JWT-based authentication
- 🔒 Password hashing with bcrypt
- 👤 User-specific data
- 🚪 Account deletion
- 🔄 Change password

### 🖼️ Profile Management

- 👤 View user profile
- ✏️ Edit username
- 📷 Upload profile picture
- ☁️ Cloudinary image storage
- 💾 Persistent profile pictures
- 🔤 User-name initial fallback when no profile image is available

### ⚙️ User Settings

- 💾 Auto-save settings
- 🔔 Notification settings
- 📱 Compact mode
- ✍️ Spell-check settings

### 🎨 UI & Experience

- ✨ Modern glassmorphism interface
- 🌌 Dark-themed design
- 📱 Responsive layout
- 🎨 Modern gradients
- ⚡ Smooth user experience
- 🖥️ Desktop and mobile friendly

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- JWT
- bcrypt
- Multer

### Database

- PostgreSQL
- Neon PostgreSQL
- `pg` / node-postgres

### Image Storage

- Cloudinary
- multer-storage-cloudinary

### Deployment

- Vercel — Frontend
- Render — Backend
- Neon — PostgreSQL Database
- Cloudinary — Profile Image Storage

---

## 📂 Project Structure

```text
Memozi/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── services/
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── middleware/
│   │   └── upload.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── ...
│   │
│   ├── package.json
│   ├── server.js
│   └── ...
│
├── .gitignore
└── README.md
```

---

# 🚀 Getting Started

Follow the steps below to run Memozi locally.

## 1. Clone the Repository

```bash
git clone https://github.com/Debasmita2003/Memozi.git
cd Memozi
```

---

## 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

## 3. Install Backend Dependencies

Open another terminal:

```bash
cd backend
npm install
```

---

# 🗄️ Database Setup

Memozi uses **PostgreSQL** for persistent data storage.

For local development, create a PostgreSQL database named:

```text
memozi
```

The production application uses **Neon PostgreSQL**.

---

## 👤 Users Table

Example users table:

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    profile_picture TEXT,
    auto_save BOOLEAN DEFAULT TRUE,
    notifications BOOLEAN DEFAULT TRUE,
    compact_mode BOOLEAN DEFAULT FALSE,
    spell_check BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📝 Notes Table

```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    color VARCHAR(30) DEFAULT '#ffffff',
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> The exact database schema may vary depending on the current version of the application.

---

# ⚙️ Environment Variables

Create a `.env` file inside the `backend` folder.

```env
DB_HOST=your_database_host
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=memozi

PORT=5000

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

FRONTEND_URL=http://localhost:3000
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production:

```env
NEXT_PUBLIC_API_URL=https://memozi-backend.onrender.com
```

> ⚠️ Never commit `.env` or `.env.local` files, database passwords, JWT secrets, or Cloudinary API secrets to GitHub.

---

# ▶️ Running the Application

## Start the Backend

```bash
cd backend
npm start
```

The backend runs on:

```text
http://localhost:5000
```

---

## Start the Frontend

In another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

---

# 📡 API Endpoints

## 🔐 Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register a new user |
| POST | `/api/auth/login` | Login user |
| PUT | `/api/auth/profile` | Update user profile |
| POST | `/api/auth/upload-profile` | Upload profile picture |
| PUT | `/api/auth/settings` | Update user settings |
| PUT | `/api/auth/change-password` | Change password |
| DELETE | `/api/auth/delete-account/:id` | Delete user account |

---

## 📝 Notes

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/notes` | Get notes |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

---

# ☁️ Profile Image Storage

Memozi uses **Cloudinary** for persistent profile image storage.

When a user uploads a profile picture:

```text
User
  │
  ▼
Next.js Frontend
  │
  ▼
Express.js API
  │
  ▼
Multer
  │
  ▼
Cloudinary
  │
  ▼
Cloudinary Image URL
  │
  ▼
PostgreSQL
```

The Cloudinary URL is stored in the user's `profile_picture` column in PostgreSQL.

Example:

```text
https://res.cloudinary.com/your-cloud/image/upload/...
```

Using Cloudinary ensures that profile pictures remain available even when the backend server is redeployed or restarted.

---

# 🔐 Security

Memozi uses several security mechanisms:

- 🔑 JWT authentication
- 🔒 bcrypt password hashing
- 🔐 Environment variables for sensitive credentials
- 🗄️ PostgreSQL parameterized queries
- ☁️ Cloudinary for persistent image storage
- 🚫 Sensitive credentials excluded from Git

Never expose or commit:

```text
DB_PASSWORD
JWT_SECRET
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

---

# 🌍 Deployment

Memozi is deployed using multiple cloud services.

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Profile Images | Cloudinary |

### 🌐 Frontend

https://memozi-project.vercel.app/

### ⚙️ Backend

https://memozi-backend.onrender.com

---

# 🔄 Deployment Workflow

Memozi is connected to GitHub.

After making changes:

```bash
git add .
git commit -m "Update Memozi"
git push origin main
```

The connected deployment services can automatically deploy the latest changes from the GitHub repository.

```text
                 GitHub
                /      \
               /        \
              ▼          ▼
          Vercel       Render
            │             │
            ▼             ▼
        Frontend       Backend
                           │
                    ┌──────┴──────┐
                    ▼             ▼
                  Neon       Cloudinary
                PostgreSQL     Images
```

---

# 📸 Screenshots

Add screenshots of your application here.

Recommended structure:

```text
screenshots/
├── home.png
├── notes.png
├── profile.png
└── settings.png
```

After adding screenshots, you can display them in this README:

```md
![Memozi Home](screenshots/home.png)

![Memozi Notes](screenshots/notes.png)

![Memozi Profile](screenshots/profile.png)

![Memozi Settings](screenshots/settings.png)
```

---

# 🔮 Future Improvements

- 🏷️ Categories and tags
- 🔍 Advanced note filtering
- 📝 Rich text editor
- 📤 Export notes
- 🔗 Share notes
- 📧 Email verification
- 🔑 Forgot password / password reset
- 📱 Progressive Web App (PWA)
- ⚡ Improved performance and caching
- 🌐 Custom domain
- 📊 Note analytics

---

# 🤝 Contributing

Contributions are welcome.

## 1. Fork the Repository

```bash
git fork https://github.com/Debasmita2003/Memozi.git
```

## 2. Create a New Branch

```bash
git checkout -b feature/new-feature
```

## 3. Make Your Changes

Implement your changes and test them locally.

## 4. Commit Your Changes

```bash
git add .
git commit -m "Add new feature"
```

## 5. Push the Branch

```bash
git push origin feature/new-feature
```

## 6. Create a Pull Request

Open a pull request on GitHub describing your changes.

---

# 👩‍💻 Author

## Debasmita Jana

💻 **GitHub:**  
https://github.com/Debasmita2003

🚀 **Live Project:**  
https://memozi-project.vercel.app/

---

# ⭐ Support

If you like Memozi, consider giving the repository a ⭐ on GitHub!

---

## 📄 License

This project was created for learning, development, and portfolio purposes.