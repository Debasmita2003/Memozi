This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

📘 Memozi – Notes & Bookmarks Manager
Memozi is a full-stack web application that allows users to create, view, and manage notes and bookmarks efficiently.
The project is built using Next.js, Express.js, and MongoDB, following clean architecture and industry best practices.
🚀 Features
📝 Notes
Create notes with title and content
View all saved notes
Delete notes
Data persists using MongoDB
🔖 Bookmarks
Add bookmarks with title and URL
View saved bookmarks
Open bookmarks in a new tab
Delete bookmarks
⚙️ Technical Features
RESTful API architecture
Environment variable security using .env
Clean separation of frontend & backend
MongoDB Atlas (Free Tier) integration
Production-ready project structure
🛠️ Tech Stack
Frontend
Next.js
React
Tailwind CSS
Backend
Node.js
Express.js
MongoDB (Atlas)
Mongoose
📁 Project Structure
Copy code

memozi/
│
├── frontend/
│   ├── pages/
│   │   ├── notes.js
│   │   ├── bookmarks.js
│   │   └── _app.js
│   ├── services/
│   │   └── api.js
│   └── styles/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Note.js
│   │   └── Bookmark.js
│   ├── routes/
│   │   ├── notes.js
│   │   └── bookmarks.js
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
🔐 Environment Variables
Create a .env file inside the backend folder:
Env
Copy code
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/memozi
⚠️ The .env file is ignored using .gitignore for security reasons.
▶️ How to Run the Project Locally
1️⃣ Clone the repository
Bash
Copy code
git clone <repository-url>
2️⃣ Backend Setup
Bash
Copy code
cd backend
npm install
node server.js
Backend runs on:
Copy code

http://localhost:5000
3️⃣ Frontend Setup
Bash
Copy code
cd frontend
npm install
npm run dev
Frontend runs on:
Copy code

http://localhost:3000
🔗 API Endpoints
Notes
GET /api/notes – Fetch all notes
POST /api/notes – Create a note
DELETE /api/notes/:id – Delete a note
Bookmarks
GET /api/bookmarks – Fetch all bookmarks
POST /api/bookmarks – Create a bookmark
DELETE /api/bookmarks/:id – Delete a bookmark
🎯 Learning Outcomes
Built a complete full-stack application
Implemented REST APIs
Connected frontend with backend using fetch API
Used MongoDB Atlas cloud database
Followed production-ready coding practices
Improved understanding of MERN-style architecture
📌 Future Improvements
User authentication (Login / Signup)
Edit notes & bookmarks
Search and filter functionality
Deployment on cloud platforms
👨‍💻 Author
DJ
Full-Stack Developer Intern
Project developed as part of an academic / internship assignment.