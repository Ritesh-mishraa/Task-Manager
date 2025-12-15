# 🚀 TaskFlow - Real-Time Collaborative Task Manager


A full-stack "Task Management Application" built with the MERN Stack (MongoDB, Express, React, Node.js). It features a Kanban-style dashboard where users can create, update, delete, and assign tasks in real-time. Changes made by one user are instantly reflected for all other connected users via WebSockets.



🌟 Key Features

🔐 Secure Authentication:** JWT-based Signup and Login system.
⚡ Real-Time Collaboration:** Powered by **Socket.io**. Updates (status changes, new tasks, deletions) appear instantly across all devices without refreshing.
📋 Kanban Dashboard:** Organize tasks by status (To Do, In Progress, Review, Completed).
🌙 Dark Mode:** Fully integrated Dark/Light mode toggle with persistent state.
👥 Task Assignment:** Assign tasks to registered users.
🎨 Modern UI:** Built with **Tailwind CSS** (v4), featuring glassmorphism, gradients, and responsive design.
🛡️ Protected Routes:** Secure endpoints and frontend route guards.

🛠️ Tech Stack

## Frontend

* React (Vite) - Fast frontend tooling.
* TypeScript - Type safety.
* Tailwind CSS - Modern styling system.
* Context API - State management for Auth and Theme.
* Socket.io-client - Real-time WebSocket communication.
* Axios - HTTP client.

## Backend

* Node.js & Express - Server runtime.
* MongoDB & Mongoose - Database and Object Modeling.
* Socket.io - WebSocket server logic.
* JWT (JSON Web Tokens) - Stateless authentication.
* Bcrypt.js - Password hashing.
* Cors - Cross-Origin Resource Sharing.

⚙️ Installation & Setup

Follow these steps to run the project locally.

1. Clone the Repository
```bash
git clone [https://github.com/your-username/task-manager.git](https://github.com/your-username/task-manager.git)
cd task-manager

2. Setup Backend
```bash
cd backend
npm install

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

Start the backend server:
```bash
npm run dev 

3. Setup Frontend
```bash 
cd ../frontend
npm install

Create a `.env` file in the `frontend` directory with the following variable:
```env
VITE_API_URL=http://localhost:5000/api

Start the frontend development server:
```bash
npm run dev

🌐 Access the Application
Open your browser and navigate to `http://localhost:5173` to access the TaskFlow application.

📂 Project Structure

├── backend/
│   ├── src/
│   │   ├── config/         # DB connection
│   │   ├── controllers/    # Route logic
│   │   ├── middleware/     # Auth checks
│   │   ├── models/         # Mongoose Schemas
│   │   ├── routes/         # Express Routes
│   │   └── app.ts          # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (TaskCard, etc.)
│   │   ├── context/        # Auth & Theme Context
│   │   ├── hooks/          # Custom Hooks (useTaskSocket)
│   │   ├── pages/          # Login, Dashboard, CreateTask
│   │   ├── services/       # Axios setup
│   │   └── types/          # TypeScript Interfaces


📚 API Endpoints
Here are the main API endpoints:

POST /api/auth/register - Register a new user,Public
POST /api/auth/login - Login user & get Token,Public
GET /api/tasks - Get all tasks,Private
POST /api/tasks - Create a new task,Private
PATCH /api/tasks/:id - Update task status,Private
DELETE /api/tasks/:id - Delete a task,Private
GET /api/users - Get list of users,Private

👥 Contributing
Contributions are welcome! Please fork the repository and create a pull request with your changes.



