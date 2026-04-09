# Task Manager Web Application Group 35

## Overview
This project is a full stack Task Manager web application built for **CPS 630 – Web Application Development**. The assignment required a MERN application with a React frontend, a Node.js/Express backend, MongoDB database integration, REST API communication, authentication, a polished user interface, and a simple real time feature.

The application lets users create an account, log in, and manage their own tasks. Each authenticated user can add, view, edit, delete, and search tasks. The backend protects task routes with JWT based authentication so users only access their own data, and the project also includes a Socket.io based real time mode/theme communication feature. 

## Main Features
- User registration with validation
- User login with JWT authentication
- Logout support by clearing saved auth data in local storage
- Protected task management for each logged in user
- Create, read, update, and delete tasks
- Optional deadlines for tasks
- Task search by text and category
- Real-time communication using Socket.io for mode/theme updates
- Responsive React interface with multiple views/pages and custom styling
  
## Tech Stack
**Frontend**
- React
- Vite
- React Router DOM

**Backend**
- Node.js
- Express
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Socket.io for real time communication
  
## Project Structure
```text
backend/
  models/
    Task.js
    User.js
  middleware/
    authMiddleware.js
  routes/
    auth.js
  server.js

frontend/
  src/
    Component/
    css/
    pages/
    utils/
    App.jsx
    main.jsx
    SearchView.jsx
  package.json
```

## How to Run the Project
### 1. Clone the repository
```bash
git clone <your-repository-url>
cd task-manager-a1
```

### 2. Install backend dependencies
```bash
cd backend
npm install
```

### 3. Create a `.env` file in the `backend` folder
Add the following values:
```env
MONGO_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_jwt_secret_here
PORT=8080
```
The backend uses `MONGO_URI`, `JWT_SECRET`, and `PORT`, with a default local MongoDB connection and port 8080 if values are not provided. 

### 4. Start the backend server
```bash
npm run start
```
The backend starts on:
```text
http://localhost:8080
```

### 5. Install frontend dependencies
Open a new terminal:
```bash
cd frontend
npm install
```

### 6. Start the frontend
```bash
npm run dev
```
The frontend runs through Vite, typically on:
```text
http://localhost:5173
```
The Socket.io server configuration also allows requests from this frontend origin. 

## How to Use the App
1. Register a new account.
2. Log in with your email and password.
3. After logging in, create tasks with optional deadlines.
4. View your saved task list.
5. Edit task text or due dates.
6. Delete tasks you no longer need.
7. Search tasks by keyword or category.
8. Log out when finished. Authentication data is stored in local storage and can be cleared on logout.

## Authentication
Authentication is handled using JSON Web Tokens. When a user registers or logs in successfully, the backend returns a token and basic user data. Protected routes require an `Authorization: Bearer <token>` header. The frontend includes helper functions to save the token, get the logged in user, attach auth headers, and clear authentication data for logout. 

## API Endpoints
### Authentication
- `POST /api/auth/register` – create a new user account
- `POST /api/auth/login` – log in an existing user
- `GET /api/auth/me` – get the currently logged in user

### Tasks
- `GET /api/tasks` – get all tasks for the logged in user
- `GET /api/tasks/:id` – get one task by id
- `POST /api/tasks` – create a new task
- `PATCH /api/tasks/:id` – update a task
- `DELETE /api/tasks/:id` – delete a task
- `GET /api/search` – search tasks by text and/or category

## Reflection
This project helped strengthen our understanding of full stack web development by combining a React frontend, an Express backend, MongoDB data storage, REST API communication, and user authentication in one application. One of the biggest successes was getting the authentication flow working so different users could register, log in, and manage their own tasks securely. Building protected routes and connecting the frontend to the backend also gave us better practical experience with the client server model.

A major challenge was making sure all parts of the application worked together smoothly, especially handling tokens correctly, protecting routes, connecting MongoDB, and keeping the user experience clean across multiple pages. The project also pushed us to think more carefully about validation, error handling, and application structure. Overall, this assignment was a good example of how the MERN stack can be used to build a practical and scalable web application. 

---
